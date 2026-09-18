import { NextResponse } from "next/server"
import {
  TWENTY_OBJECT_PLURALS,
  extractTwentyId,
  mapCompanyToTwenty,
  mapOpportunityToTwenty,
  mapPersonToTwenty,
  twentyFetch,
  TwentyNotConfiguredError,
  TWENTY_SETUP_HINT,
  type MacrumRecordType,
} from "@/lib/twenty"

const MAPPERS: Record<MacrumRecordType, (record: never) => Record<string, unknown>> = {
  company: (r) => mapCompanyToTwenty(r as never),
  person: (r) => mapPersonToTwenty(r as never),
  opportunity: (r) => mapOpportunityToTwenty(r as never),
}

/**
 * POST /api/twenty/sync
 * Body: { type: "company" | "person" | "opportunity", record: {...} }
 *
 * Local data lives in browser localStorage, so the client sends the FULL
 * record payload. If the record already carries a `twentyId` it is PATCHed
 * in Twenty; otherwise it is created. Returns { twentyId, type } for the
 * client to store back on its local record. 503 + setup hint when no key.
 */
export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 })
  }

  const { type, record } = (body ?? {}) as {
    type?: string
    record?: Record<string, unknown> & { id?: string; name?: string; twentyId?: string }
  }

  if (!type || !(type in TWENTY_OBJECT_PLURALS)) {
    return NextResponse.json(
      {
        error: `Unsupported type. Use one of: ${Object.keys(TWENTY_OBJECT_PLURALS).join(", ")}.`,
      },
      { status: 400 },
    )
  }
  if (!record || typeof record !== "object" || typeof record.name !== "string" || !record.name.trim()) {
    return NextResponse.json({ error: "Body must include record.name." }, { status: 400 })
  }

  try {
    const plural = TWENTY_OBJECT_PLURALS[type as MacrumRecordType]
    const payload = MAPPERS[type as MacrumRecordType](record as never)
    const existingId = typeof record.twentyId === "string" ? record.twentyId.trim() : ""

    let result: unknown
    if (existingId) {
      result = await twentyFetch(`/${plural}/${existingId}`, { method: "PATCH", body: payload })
    } else {
      result = await twentyFetch(`/${plural}`, { method: "POST", body: payload })
    }

    const twentyId = extractTwentyId(result, plural) ?? (existingId || null)
    if (!twentyId) {
      return NextResponse.json(
        { error: "Twenty did not return a record id." },
        { status: 502 },
      )
    }
    return NextResponse.json({ twentyId, type })
  } catch (err) {
    if (err instanceof TwentyNotConfiguredError) {
      return NextResponse.json({ error: err.message, hint: TWENTY_SETUP_HINT }, { status: 503 })
    }
    const status = (err as { status?: number }).status ?? 502
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown Twenty error" },
      { status },
    )
  }
}
