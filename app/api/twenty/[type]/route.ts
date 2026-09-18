import { NextResponse } from "next/server"
import {
  twentyFetch,
  unwrapTwentyList,
  TwentyNotConfiguredError,
  TWENTY_SETUP_HINT,
} from "@/lib/twenty"

const TYPE_WHITELIST = ["companies", "people", "opportunities"] as const
type ListedType = (typeof TYPE_WHITELIST)[number]

const FORWARDED_PARAMS = ["limit", "starting_after", "ending_before", "filter", "depth", "order_by"] as const

/**
 * GET /api/twenty/[type]
 * Lists records from Twenty for one of: companies | people | opportunities.
 * Forwards Twenty list query params (limit, filter, depth, order_by, cursors).
 * Returns { records, totalCount, pageInfo }. 503 + setup hint when no key.
 */
export async function GET(req: Request, { params }: { params: Promise<{ type: string }> }) {
  const { type } = await params
  if (!(TYPE_WHITELIST as readonly string[]).includes(type)) {
    return NextResponse.json(
      { error: `Unsupported type "${type}". Use one of: ${TYPE_WHITELIST.join(", ")}.` },
      { status: 400 },
    )
  }

  try {
    const { searchParams } = new URL(req.url)
    const forwarded: Record<string, string> = {}
    for (const p of FORWARDED_PARAMS) {
      const v = searchParams.get(p)
      if (v) forwarded[p] = v
    }
    const payload = await twentyFetch(`/${type}`, { searchParams: forwarded })
    const { records, totalCount, pageInfo } = unwrapTwentyList(payload, type as ListedType)
    return NextResponse.json({ type, records, totalCount, pageInfo })
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
