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

interface BreakdownTask {
  title: string
  priority: "low" | "medium" | "high"
  dueOffsetDays: number
}

const SCHEMA_HINT = `{"tasks":[{"title":"string","priority":"low|medium|high","dueOffsetDays":0}]}`

export async function POST(req: NextRequest) {
  if (!aiConfig().configured) {
    return aiNotConfiguredResponse()
  }

  let body: { brief?: string; projectContext?: string }
  try {
    body = await req.json()
  } catch {
    return aiErrorResponse("Invalid request body. Send JSON with a brief.", 400)
  }

  const brief = (body.brief || "").trim()
  if (!brief) {
    return aiErrorResponse("A brief is required.", 400)
  }

  try {
    const result = await chatJson<{ tasks: BreakdownTask[] }>(
      [
        {
          role: "system",
          content:
            "You break a project brief into a short, clear task list. Use plain language. " +
            "Each task has a title, a priority (low, medium, or high), and dueOffsetDays " +
            "(a whole number: how many days from today the task is due). " +
            "Return 3 to 10 tasks, ordered from first to last.",
        },
        {
          role: "user",
          content:
            `Project context: ${body.projectContext || "not provided"}\n\n` +
            `Brief: ${brief.slice(0, 4000)}`,
        },
      ],
      SCHEMA_HINT,
    )

    const tasks = (result.tasks || []).slice(0, 10).map((t) => ({
      title: String(t.title || "Untitled task").slice(0, 200),
      priority: ["low", "medium", "high"].includes(t.priority) ? t.priority : "medium",
      dueOffsetDays: Number.isFinite(t.dueOffsetDays) ? Math.max(0, Math.round(t.dueOffsetDays)) : 0,
    }))

    return jsonResponse({ tasks })
  } catch (err) {
    return aiErrorResponse(err instanceof AiError ? err.message : "Failed to generate the task breakdown.")
  }
}
