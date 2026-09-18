// lib/ai.ts — SERVER ONLY. Import only from server code (route handlers in
// app/api/ai/*). Never import from client components.

const DEFAULT_BASE_URL = "https://openrouter.ai/api/v1"
const DEFAULT_MODEL = "openai/gpt-4o-mini"
const TIMEOUT_MS = 25_000

export const AI_NOT_CONFIGURED_HINT = "add AI_API_KEY"

export function aiConfig() {
  const key = process.env.AI_API_KEY
  const baseUrl = (process.env.AI_API_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, "")
  const model = process.env.AI_MODEL || DEFAULT_MODEL
  return { key, baseUrl, model, configured: Boolean(key) }
}

export interface ChatMessage {
  role: "system" | "user" | "assistant"
  content: string
}

interface ChatCompletionResponse {
  choices?: { message?: { content?: string } }[]
}

/**
 * Call the OpenAI-compatible chat/completions endpoint.
 * Throws when AI is not configured or the request fails.
 */
export async function chat(messages: ChatMessage[]): Promise<string> {
  const { key, baseUrl, model } = aiConfig()
  if (!key) {
    throw new AiNotConfiguredError()
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  let res: Response
  try {
    res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({ model, messages }),
      signal: controller.signal,
    })
  } catch (err) {
    if ((err as Error).name === "AbortError") {
      throw new AiError("The AI request timed out. Please try again.")
    }
    throw new AiError("Could not reach the AI service. Please try again.")
  } finally {
    clearTimeout(timer)
  }

  if (!res.ok) {
    // Never include the key or prompt content in the error.
    throw new AiError(`The AI service returned an error (${res.status}). Please try again.`)
  }

  const data = (await res.json()) as ChatCompletionResponse
  const content = data.choices?.[0]?.message?.content?.trim()
  if (!content) {
    throw new AiError("The AI service returned an empty response. Please try again.")
  }
  return content
}

/**
 * Chat with a JSON-shaped reply. The model is asked to return a JSON object
 * matching the schema hint; the helper extracts the first JSON object from
 * the response and parses it.
 */
export async function chatJson<T>(
  messages: ChatMessage[],
  schemaHint: string,
): Promise<T> {
  const wrapped: ChatMessage[] = [
    ...messages,
    {
      role: "system",
      content: `Reply with ONLY a JSON object matching this shape: ${schemaHint}. No markdown fences, no extra text.`,
    },
  ]
  const raw = await chat(wrapped)
  const start = raw.indexOf("{")
  const end = raw.lastIndexOf("}")
  const jsonText = start >= 0 && end > start ? raw.slice(start, end + 1) : raw
  try {
    return JSON.parse(jsonText) as T
  } catch {
    throw new AiError("The AI response was not valid JSON. Please try again.")
  }
}

/**
 * Standard JSON error payload for the /api/ai/* routes.
 */
export function jsonResponse(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  })
}

export function aiNotConfiguredResponse() {
  return jsonResponse({ error: "AI is not configured.", hint: AI_NOT_CONFIGURED_HINT }, 503)
}

export function aiErrorResponse(message: string, status = 500) {
  return jsonResponse({ error: message }, status)
}

export class AiError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "AiError"
  }
}

export class AiNotConfiguredError extends AiError {
  constructor() {
    super("AI is not configured.")
    this.name = "AiNotConfiguredError"
  }
}
