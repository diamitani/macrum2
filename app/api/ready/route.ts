import { NextResponse } from "next/server"

/**
 * GET /api/ready — readiness probe.
 * Reports env presence (NAMES ONLY — never values) for the optional
 * integrations. A missing key means that integration is simply
 * disabled; the app itself is always ready.
 */
export async function GET() {
  const checks: Record<string, boolean> = {
    TWENTY_API_KEY: Boolean(process.env.TWENTY_API_KEY),
    TWENTY_API_URL: Boolean(process.env.TWENTY_API_URL),
    AI_API_KEY: Boolean(process.env.AI_API_KEY),
    AI_API_BASE_URL: Boolean(process.env.AI_API_BASE_URL),
    AI_MODEL: Boolean(process.env.AI_MODEL),
  }

  return NextResponse.json({
    ok: true,
    integrations: {
      twenty: checks.TWENTY_API_KEY,
      ai: checks.AI_API_KEY,
    },
    env: checks,
    time: new Date().toISOString(),
  })
}
