import { NextRequest } from "next/server"
import {
  aiConfig,
  aiNotConfiguredResponse,
  aiErrorResponse,
  jsonResponse,
  chat,
  AiError,
} from "@/lib/ai"

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  if (!aiConfig().configured) {
    return aiNotConfiguredResponse()
  }

  let body: { overdue?: unknown[]; dueToday?: unknown[]; pipeline?: unknown }
  try {
    body = await req.json()
  } catch {
    return aiErrorResponse("Invalid request body.", 400)
  }

  // Keep the payload small and strip anything beyond what the brief needs.
  const payload = {
    overdue: Array.isArray(body.overdue) ? body.overdue.slice(0, 20) : [],
    dueToday: Array.isArray(body.dueToday) ? body.dueToday.slice(0, 20) : [],
    pipeline: body.pipeline ?? null,
  }

  try {
    const brief = await chat([
      {
        role: "system",
        content:
          "You write a morning briefing for a small business owner. Use plain, simple markdown: " +
          "a short greeting line, then sections for 'Overdue', 'Due today', and 'Pipeline'. " +
          "End with the 3 most important things to do today. Keep it short and easy to scan. " +
          "No emojis.",
      },
      { role: "user", content: JSON.stringify(payload).slice(0, 6000) },
    ])

    return jsonResponse({ brief: brief.slice(0, 4000) })
  } catch (err) {
    return aiErrorResponse(err instanceof AiError ? err.message : "Failed to generate the briefing.")
  }
}
