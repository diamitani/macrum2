import { NextResponse } from "next/server"
import {
  TWENTY_OBJECT_PLURALS,
  normalizeTwentyCompany,
  normalizeTwentyOpportunity,
  normalizeTwentyPerson,
  twentyFetch,
  unwrapTwentyList,
  TwentyNotConfiguredError,
  TWENTY_SETUP_HINT,
  type MacrumRecordType,
} from "@/lib/twenty"

const NORMALIZERS: Record<MacrumRecordType, (r: Record<string, unknown>) => unknown> = {
  company: normalizeTwentyCompany,
  person: normalizeTwentyPerson,
  opportunity: normalizeTwentyOpportunity,
}

/**
 * POST /api/twenty/pull
 * Body: { type: "company" | "person" | "opportunity", limit?: number }
 * Returns Twenty records normalized to Macrum shape so the client can
 * dedupe (by twentyId / email) and merge into local state.
 * 503 + setup hint when no key.
 */
export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 })
  }

  const { type, limit } = (body ?? {}) as { type?: string; limit?: number }

  if (!type || !(type in TWENTY_OBJECT_PLURALS)) {
    return NextResponse.json(
      {
        error: `Unsupported type. Use one of: ${Object.keys(TWENTY_OBJECT_PLURALS).join(", ")}.`,
      },
      { status: 400 },
    )
  }

  try {
    const plural = TWENTY_OBJECT_PLURALS[type as MacrumRecordType]
    const safeLimit = Number.isFinite(Number(limit)) ? Math.max(1, Math.min(200, Number(limit))) : 100
    const payload = await twentyFetch(`/${plural}`, {
      searchParams: { limit: String(safeLimit), depth: "1" },
    })
    const { records, totalCount, pageInfo } = unwrapTwentyList<Record<string, unknown>>(
      payload,
      plural,
    )
    const normalize = NORMALIZERS[type as MacrumRecordType]
    return NextResponse.json({
      type,
      records: records.map((r) => normalize(r)),
      totalCount,
      pageInfo,
    })
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
