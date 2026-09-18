import { NextResponse } from "next/server"
import {
  getTwentyConfig,
  twentyFetch,
  unwrapTwentyList,
  TwentyNotConfiguredError,
  TWENTY_SETUP_HINT,
} from "@/lib/twenty"

/**
 * GET /api/twenty/status
 * Verifies the Twenty integration: with a key set, performs a cheap
 * `GET /rest/companies?limit=1` probe. Never echoes the API key.
 * Returns 503 + setup hint when TWENTY_API_KEY is unset.
 */
export async function GET() {
  const { baseUrl, hasKey } = getTwentyConfig()

  if (!hasKey) {
    return NextResponse.json(
      {
        configured: false,
        baseUrl,
        hint: TWENTY_SETUP_HINT,
      },
      { status: 503 },
    )
  }

  try {
    const payload = await twentyFetch("/companies", { searchParams: { limit: "1" } })
    const { totalCount } = unwrapTwentyList(payload, "companies")
    return NextResponse.json({
      configured: true,
      baseUrl,
      ok: true,
      companiesCount: totalCount,
    })
  } catch (err) {
    const status = (err as { status?: number }).status
    const message = err instanceof Error ? err.message : "Unknown Twenty error"
    return NextResponse.json(
      {
        configured: true,
        baseUrl,
        ok: false,
        error: message,
        hint:
          status === 401
            ? "Twenty rejected the API key. Regenerate it under Settings → API & Webhooks in Twenty."
            : "Could not reach Twenty. Check TWENTY_API_URL and your network.",
      },
      { status: status === 401 ? 401 : 502 },
    )
  }
}
