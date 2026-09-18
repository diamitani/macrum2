"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sun, Loader2, AlertCircle, RefreshCw } from "lucide-react"
import { AiNotConfigured } from "@/components/ai/not-configured"

export interface BriefingInput {
  overdue: { title: string; dueDate?: string; projectName?: string }[]
  dueToday: { title: string; dueDate?: string; projectName?: string }[]
  pipeline: Record<string, unknown>
}

interface DailyBriefingProps {
  input: BriefingInput
  autoLoad?: boolean
}

/** Tiny markdown renderer for the briefing text (headings, bullets, bold). */
function renderMarkdown(text: string) {
  const renderInline = (line: string, key: string) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g)
    return (
      <span key={key}>
        {parts.map((part, i) =>
          part.startsWith("**") && part.endsWith("**") && part.length > 4 ? (
            <strong key={i}>{part.slice(2, -2)}</strong>
          ) : (
            <span key={i}>{part}</span>
          ),
        )}
      </span>
    )
  }

  return text.split("\n").map((line, i) => {
    const trimmed = line.trim()
    if (!trimmed) return <span key={i} className="block h-2" />
    if (trimmed.startsWith("### ")) {
      return (
        <h4 key={i} className="mt-3 text-sm font-semibold">
          {renderInline(trimmed.slice(4), `h-${i}`)}
        </h4>
      )
    }
    if (trimmed.startsWith("## ")) {
      return (
        <h3 key={i} className="mt-3 text-base font-semibold">
          {renderInline(trimmed.slice(3), `h-${i}`)}
        </h3>
      )
    }
    if (trimmed.startsWith("# ")) {
      return (
        <h2 key={i} className="mt-2 text-lg font-semibold">
          {renderInline(trimmed.slice(2), `h-${i}`)}
        </h2>
      )
    }
    if (/^[-*•]\s/.test(trimmed)) {
      return (
        <li key={i} className="ml-4 list-disc text-sm leading-relaxed">
          {renderInline(trimmed.replace(/^[-*•]\s/, ""), `b-${i}`)}
        </li>
      )
    }
    if (/^\d+\.\s/.test(trimmed)) {
      return (
        <li key={i} className="ml-4 list-decimal text-sm leading-relaxed">
          {renderInline(trimmed.replace(/^\d+\.\s/, ""), `n-${i}`)}
        </li>
      )
    }
    return (
      <p key={i} className="text-sm leading-relaxed">
        {renderInline(trimmed, `p-${i}`)}
      </p>
    )
  })
}

export function DailyBriefing({ input, autoLoad = false }: DailyBriefingProps) {
  const [brief, setBrief] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notConfigured, setNotConfigured] = useState(false)

  const load = async () => {
    setIsLoading(true)
    setError(null)
    setNotConfigured(false)
    try {
      const res = await fetch("/api/ai/briefing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      })
      if (res.status === 503) {
        setNotConfigured(true)
        return
      }
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate the briefing.")
      }
      setBrief(data.brief || "")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.")
    } finally {
      setIsLoading(false)
    }
  }

  // Auto-load once on mount when requested.
  const hasTriedAuto = useRef(false)
  useEffect(() => {
    if (autoLoad && !hasTriedAuto.current) {
      hasTriedAuto.current = true
      void load()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoLoad])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sun className="h-4 w-4 text-muted-foreground" />
              Daily briefing
            </CardTitle>
            <CardDescription>Your day at a glance: overdue, due today, and pipeline</CardDescription>
          </div>
          {brief && !isLoading && (
            <Button variant="ghost" size="sm" onClick={load} title="Refresh briefing">
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {notConfigured ? (
          <AiNotConfigured compact />
        ) : !brief && !isLoading ? (
          <div className="py-4 text-center">
            <p className="text-sm text-muted-foreground">
              Get a short, plain-language rundown of what needs your attention today.
            </p>
            <Button onClick={load} className="mt-3" variant="outline">
              <Sun className="mr-2 h-4 w-4" />
              Generate briefing
            </Button>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">Putting your day together...</span>
          </div>
        ) : (
          <div className="space-y-1">{brief ? renderMarkdown(brief) : null}</div>
        )}

        {error && (
          <p className="mt-3 flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            {error}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
