import { NextResponse } from "next/server"
import packageJson from "@/package.json"

/**
 * GET /api/health — liveness probe.
 * Always 200 when the app is serving.
 */
export async function GET() {
  return NextResponse.json({
    ok: true,
    version: packageJson.version,
    time: new Date().toISOString(),
  })
}
