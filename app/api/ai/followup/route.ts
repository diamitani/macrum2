import { NextRequest } from "next/server"
import {
  aiConfig,
  aiNotConfiguredResponse,
  aiErrorResponse,
  jsonResponse,
  chatJson,
  AiError,
} from "@/lib/ai"

export const runtime = "nodejs"

const SCHEMA_HINT = `{"subject":"string","body":"string"}`

export async function POST(req: NextRequest) {
  if (!aiConfig().configured) {
    return aiNotConfiguredResponse()
  }

  let body: { recordType?: string; name?: string; context?: string }
  try {
    body = await req.json()
  } catch {
    return aiErrorResponse("Invalid request body.", 400)
  }

  const recordType = body.recordType === "deal" ? "deal" : "contact"
  const name = (body.name || "").trim()
  if (!name) {
    return aiErrorResponse("A name is required.", 400)
  }
  const context = (body.context || "").trim()

  try {
    const result = await chatJson<{ subject: string; body: string }>(
      [
        {
          role: "system",
          content:
            "You draft short, friendly follow-up emails for a small business owner. " +
            "Use plain language, one clear ask, and a polite sign-off. Keep the body under 150 words.",
        },
        {
          role: "user",
          content:
            `Record type: ${recordType}\nName: ${name}\n` +
            `Context: ${context ? context.slice(0, 4000) : "not provided"}`,
        },
      ],
      SCHEMA_HINT,
    )

    return jsonResponse({
      subject: String(result.subject || "").slice(0, 200),
      body: String(result.body || "").slice(0, 3000),
    })
  } catch (err) {
    return aiErrorResponse(err instanceof AiError ? err.message : "Failed to draft the follow-up.")
  }
}
