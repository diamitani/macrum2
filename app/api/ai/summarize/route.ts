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

const SCHEMA_HINT = `{"summary":["bullet 1","bullet 2","bullet 3"],"actions":["action 1","action 2"]}`

export async function POST(req: NextRequest) {
  if (!aiConfig().configured) {
    return aiNotConfiguredResponse()
  }

  let body: { note?: string }
  try {
    body = await req.json()
  } catch {
    return aiErrorResponse("Invalid request body. Send JSON with a note.", 400)
  }

  const note = (body.note || "").trim()
  if (!note) {
    return aiErrorResponse("A note is required.", 400)
  }

  try {
    const result = await chatJson<{ summary: string[]; actions: string[] }>(
      [
        {
          role: "system",
          content:
            "You summarize notes in plain, simple language. " +
            "Return exactly 3 short summary bullets and up to 5 concrete next actions. " +
            "If the note contains no clear actions, return an empty actions array.",
        },
        { role: "user", content: note.slice(0, 6000) },
      ],
      SCHEMA_HINT,
    )

    return jsonResponse({
      summary: (result.summary || []).slice(0, 3).map((s) => String(s).slice(0, 300)),
      actions: (result.actions || []).slice(0, 5).map((a) => String(a).slice(0, 300)),
    })
  } catch (err) {
    return aiErrorResponse(err instanceof AiError ? err.message : "Failed to summarize the note.")
  }
}
