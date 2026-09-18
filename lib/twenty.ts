/**
 * Twenty CRM integration — SERVER ONLY.
 *
 * Reads `TWENTY_API_KEY` and `TWENTY_API_URL` exclusively from server-side
 * environment (process.env). This module is never imported by client
 * components — every API surface talks to the Next.js route handlers in
 * `app/api/twenty/` instead, which scrub the key from all responses.
 *
 * The guard below fails loudly (instead of silently bundling) if anyone
 * imports this file into client code.
 */
if (typeof window !== "undefined") {
  throw new Error("lib/twenty.ts is server-only and must not be imported into client code.")
}

/** Default base URL used when TWENTY_API_URL is unset (Twenty Cloud). */
export const DEFAULT_TWENTY_API_URL = "https://api.twenty.com"

/** Setup hint returned to the client whenever the integration is not configured. */
export const TWENTY_SETUP_HINT =
  "Set TWENTY_API_KEY (and optionally TWENTY_API_URL) as server environment variables, " +
  "then redeploy. Get an API key in Twenty under Settings → API & Webhooks → + Create key. " +
  "Nothing is stored in the browser or in git."

/** Request timeout for all outbound Twenty calls. */
export const TWENTY_FETCH_TIMEOUT_MS = 25_000

/** Macrum record categories ↔ Twenty standard objects. */
export type MacrumRecordType = "company" | "person" | "opportunity"

export const TWENTY_OBJECT_PLURALS: Record<MacrumRecordType, string> = {
  company: "companies",
  person: "people",
  opportunity: "opportunities",
}

/** Loose Macrum-side shapes accepted by the sync route (local data lives in the client). */
export interface MacrumCompanyLike {
  id: string
  name: string
  website?: string
  industry?: string
  email?: string
  phone?: string
  address?: string
  twentyId?: string
}

export interface MacrumPersonLike {
  id: string
  name: string
  email?: string
  phone?: string
  jobTitle?: string
  /** Local Macrum company id of the employer (informational; not sent to Twenty). */
  companyId?: string
  /** Twenty id of the employer company — passed when the company was already synced. */
  twentyCompanyId?: string
  twentyId?: string
}

export interface MacrumDealLike {
  id: string
  name: string
  amount?: number
  currency?: string
  stage?: string
  closeDate?: string
  /** Local Macrum company id (informational; not sent to Twenty). */
  companyId?: string
  /** Twenty id of the linked company — passed when the company was already synced. */
  twentyCompanyId?: string
  /** Twenty id of the linked person — passed when the contact was already synced. */
  twentyPersonId?: string
  twentyId?: string
}

/** Macrum deal stage → Twenty opportunity stage (default Twenty pipeline). */
export const MACRUM_STAGE_TO_TWENTY: Record<string, string> = {
  lead: "INCOMING",
  qualified: "QUALIFIED",
  proposal: "PROPOSAL",
  negotiation: "MEETING",
  won: "WON",
  lost: "LOST",
}

/** Reverse map for normalizing Twenty opportunities back to Macrum shape. */
export const TWENTY_STAGE_TO_MACRUM: Record<string, string> = Object.fromEntries(
  Object.entries(MACRUM_STAGE_TO_TWENTY).map(([k, v]) => [v, k]),
)

export class TwentyNotConfiguredError extends Error {
  readonly status = 503
  constructor() {
    super(`Twenty API key is not configured. ${TWENTY_SETUP_HINT}`)
    this.name = "TwentyNotConfiguredError"
  }
}

export interface TwentyConfig {
  baseUrl: string
  hasKey: boolean
}

/** Server-only config read. Returns the base URL and whether a key is present.
 *  The key value itself is never returned — only its presence. */
export function getTwentyConfig(): TwentyConfig {
  const baseUrl = (process.env.TWENTY_API_URL || DEFAULT_TWENTY_API_URL).replace(/\/+$/, "")
  const hasKey = Boolean(process.env.TWENTY_API_KEY?.trim())
  return { baseUrl, hasKey }
}

function getApiKeyOrThrow(): string {
  const key = process.env.TWENTY_API_KEY?.trim()
  if (!key) throw new TwentyNotConfiguredError()
  return key
}

export interface TwentyFetchOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE"
  body?: unknown
  searchParams?: Record<string, string | number>
  signal?: AbortSignal
}

function extractTwentyErrorMessage(data: unknown): string | null {
  if (!data || typeof data !== "object") return null
  const d = data as Record<string, unknown>
  if (typeof d.message === "string" && d.message) return d.message
  if (Array.isArray(d.messages)) return d.messages.filter(Boolean).join("; ") || null
  if (typeof d.error === "string" && d.error) return d.error
  return null
}

/**
 * Low-level Twenty Core REST call.
 * - Auth: `Authorization: Bearer <TWENTY_API_KEY>`
 * - Timeout: 25s (AbortController)
 * - Throws TwentyNotConfiguredError when no key is set; Error with `.status`
 *   on HTTP errors. Never echoes the key in errors.
 */
export async function twentyFetch(path: string, opts: TwentyFetchOptions = {}): Promise<unknown> {
  const { baseUrl } = getTwentyConfig()
  const apiKey = getApiKeyOrThrow()
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  const url = new URL(`${baseUrl}/rest${normalizedPath}`)
  for (const [k, v] of Object.entries(opts.searchParams ?? {})) {
    if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v))
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TWENTY_FETCH_TIMEOUT_MS)
  try {
    const res = await fetch(url.toString(), {
      method: opts.method ?? "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
      signal: opts.signal ?? controller.signal,
    })
    const text = await res.text()
    let data: unknown = null
    try {
      data = text ? JSON.parse(text) : null
    } catch {
      data = { raw: text }
    }
    if (!res.ok) {
      const message = extractTwentyErrorMessage(data) ?? `Twenty API request failed (HTTP ${res.status})`
      const err = new Error(message) as Error & { status?: number }
      err.status = res.status
      throw err
    }
    return data
  } finally {
    clearTimeout(timer)
  }
}

export interface TwentyListResult<T> {
  records: T[]
  totalCount: number
  pageInfo?: { startCursor?: string; endCursor?: string; hasNextPage?: boolean } | null
}

/**
 * Unwrap the Twenty REST list envelope: `{ data: { <plural>: [...] }, pageInfo, totalCount }`.
 * Tolerates a bare array as well.
 */
export function unwrapTwentyList<T>(payload: unknown, plural: string): TwentyListResult<T> {
  const d = (payload ?? {}) as Record<string, unknown>
  let records: T[] = []
  if (Array.isArray(d)) {
    records = d as T[]
  } else if (d.data && typeof d.data === "object") {
    const inner = (d.data as Record<string, unknown>)[plural]
    if (Array.isArray(inner)) records = inner as T[]
  }
  const totalCount = typeof d.totalCount === "number" ? d.totalCount : records.length
  const pageInfo = (d.pageInfo ?? null) as TwentyListResult<T>["pageInfo"]
  return { records, totalCount, pageInfo }
}

/** Extract the created/updated record id from a Twenty write response (defensive over shapes). */
export function extractTwentyId(payload: unknown, plural: string): string | null {
  const d = (payload ?? {}) as Record<string, unknown>
  const candidates: unknown[] = []
  if (d.data && typeof d.data === "object") {
    const data = d.data as Record<string, unknown>
    candidates.push(data[plural], data.id)
  }
  candidates.push(d.id, d[plural])
  for (const c of candidates) {
    if (c && typeof c === "object" && typeof (c as Record<string, unknown>).id === "string") {
      return (c as Record<string, unknown>).id as string
    }
    if (typeof c === "string" && c) return c
  }
  return null
}

// ---------------------------------------------------------------------------
// Macrum → Twenty mappings
// ---------------------------------------------------------------------------

function splitName(fullName: string): { firstName: string; lastName: string } {
  const parts = (fullName || "").trim().split(/\s+/)
  return {
    firstName: parts[0] ?? "",
    lastName: parts.slice(1).join(" ") || "",
  }
}

function normalizeUrl(raw: string): string {
  const trimmed = raw.trim()
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `https://${trimmed}`
}

/**
 * Macrum company → Twenty company.
 * Verified against Twenty docs: `name` (TEXT), `domainName` (LINKS composite:
 * `{ primaryLinkUrl }`). Anything else is dropped so unknown fields can't leak.
 */
export function mapCompanyToTwenty(record: MacrumCompanyLike): Record<string, unknown> {
  const body: Record<string, unknown> = { name: record.name }
  if (record.website?.trim()) body.domainName = { primaryLinkUrl: normalizeUrl(record.website) }
  return body
}

/**
 * Macrum contact → Twenty person.
 * Doc diff (noted vs the DDC fence): Twenty has NO flat `email` field — it is
 * the `emails` composite `{ primaryEmail }`. Same for `phones` and the
 * `name` FULL_NAME composite `{ firstName, lastName }`.
 */
export function mapPersonToTwenty(record: MacrumPersonLike): Record<string, unknown> {
  const { firstName, lastName } = splitName(record.name)
  const body: Record<string, unknown> = { name: { firstName, lastName } }
  if (record.email?.trim()) body.emails = { primaryEmail: record.email.trim() }
  if (record.phone?.trim()) body.phones = { primaryPhoneNumber: record.phone.trim() }
  if (record.jobTitle?.trim()) body.jobTitle = record.jobTitle.trim()
  if (record.twentyCompanyId?.trim()) body.companyId = record.twentyCompanyId.trim()
  return body
}

/**
 * Macrum deal → Twenty opportunity.
 * `amount` is the CURRENCY composite `{ amountMicros, currencyCode }`
 * (amountMicros = amount × 1_000_000). `stage` maps through the default
 * Twenty pipeline enum (INCOMING, QUALIFIED, MEETING, PROPOSAL, WON, LOST).
 */
export function mapOpportunityToTwenty(record: MacrumDealLike): Record<string, unknown> {
  const body: Record<string, unknown> = { name: record.name }
  if (typeof record.amount === "number" && Number.isFinite(record.amount)) {
    body.amount = {
      amountMicros: Math.round(record.amount * 1_000_000),
      currencyCode: (record.currency || "USD").trim().toUpperCase().slice(0, 3),
    }
  }
  if (record.stage) {
    body.stage = MACRUM_STAGE_TO_TWENTY[record.stage] ?? record.stage
  }
  if (record.closeDate?.trim()) {
    const parsed = new Date(record.closeDate)
    if (!Number.isNaN(parsed.getTime())) body.closeDate = parsed.toISOString()
  }
  if (record.twentyCompanyId?.trim()) body.companyId = record.twentyCompanyId.trim()
  if (record.twentyPersonId?.trim()) body.pointOfContactId = record.twentyPersonId.trim()
  return body
}

// ---------------------------------------------------------------------------
// Twenty → Macrum normalizers (used by /api/twenty/pull)
// ---------------------------------------------------------------------------

export interface NormalizedCompany {
  twentyId: string
  name: string
  website?: string
  email?: string
  phone?: string
  address?: string
}

export interface NormalizedPerson {
  twentyId: string
  name: string
  email?: string
  phone?: string
  jobTitle?: string
  companyId?: string
  companyName?: string
}

export interface NormalizedOpportunity {
  twentyId: string
  name: string
  amount?: number
  currency?: string
  stage?: string
  closeDate?: string
  companyId?: string
  companyName?: string
}

type AnyRecord = Record<string, unknown>

export function normalizeTwentyCompany(r: AnyRecord): NormalizedCompany {
  const domain = r.domainName as AnyRecord | undefined
  const address = r.address as AnyRecord | undefined
  const out: NormalizedCompany = { twentyId: String(r.id ?? ""), name: String(r.name ?? "") }
  if (domain?.primaryLinkUrl) out.website = String(domain.primaryLinkUrl)
  const addr = address?.addressCity ? String(address.addressCity) : ""
  if (addr) out.address = addr
  return out
}

export function normalizeTwentyPerson(r: AnyRecord): NormalizedPerson {
  const name = r.name as AnyRecord | undefined
  const emails = r.emails as AnyRecord | undefined
  const phones = r.phones as AnyRecord | undefined
  const company = r.company as AnyRecord | undefined
  const firstName = String(name?.firstName ?? "")
  const lastName = String(name?.lastName ?? "")
  const out: NormalizedPerson = {
    twentyId: String(r.id ?? ""),
    name: [firstName, lastName].filter(Boolean).join(" "),
  }
  if (emails?.primaryEmail) out.email = String(emails.primaryEmail)
  if (phones?.primaryPhoneNumber) out.phone = String(phones.primaryPhoneNumber)
  if (r.jobTitle) out.jobTitle = String(r.jobTitle)
  const companyId = (company?.id as string | undefined) ?? (r.companyId as string | undefined)
  if (companyId) out.companyId = String(companyId)
  if (company?.name) out.companyName = String(company.name)
  return out
}

export function normalizeTwentyOpportunity(r: AnyRecord): NormalizedOpportunity {
  const amount = r.amount as AnyRecord | undefined
  const company = r.company as AnyRecord | undefined
  const out: NormalizedOpportunity = {
    twentyId: String(r.id ?? ""),
    name: String(r.name ?? ""),
  }
  if (typeof amount?.amountMicros === "number") out.amount = (amount.amountMicros as number) / 1_000_000
  if (amount?.currencyCode) out.currency = String(amount.currencyCode)
  if (r.stage) {
    const stage = String(r.stage)
    out.stage = TWENTY_STAGE_TO_MACRUM[stage] ?? stage
  }
  if (r.closeDate) out.closeDate = String(r.closeDate)
  const companyId = (company?.id as string | undefined) ?? (r.companyId as string | undefined)
  if (companyId) out.companyId = String(companyId)
  if (company?.name) out.companyName = String(company.name)
  return out
}
