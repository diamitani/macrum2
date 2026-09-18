"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles, Loader2, AlertCircle, ListChecks } from "lucide-react"
import { AiNotConfigured } from "@/components/ai/not-configured"

interface SummarizeButtonProps {
  noteTitle: string
  noteContent: string
  className?: string
}

/**
 * Per-note "Summarize" button. Renders the 3-bullet summary and action
 * items inline below the button once generated.
 */
export function SummarizeButton({ noteTitle, noteContent, className }: SummarizeButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [summary, setSummary] = useState<string[] | null>(null)
  const [actions, setActions] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [notConfigured, setNotConfigured] = useState(false)

  const handleSummarize = async () => {
    setIsLoading(true)
    setError(null)
    setNotConfigured(false)
    try {
      const res = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: `${noteTitle}\n\n${noteContent}` }),
      })
      if (res.status === 503) {
        setNotConfigured(true)
        return
      }
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Failed to summarize the note.")
      }
      setSummary(data.summary || [])
      setActions(data.actions || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={className}>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleSummarize}
        disabled={isLoading || !noteContent.trim()}
        className="text-amber-700 hover:text-amber-800 hover:bg-amber-100"
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="mr-2 h-4 w-4" />
        )}
        {summary ? "Re-summarize" : "Summarize"}
      </Button>

      {notConfigured && (
        <div className="mt-3">
          <AiNotConfigured compact />
        </div>
      )}

      {error && (
        <p className="mt-3 flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          {error}
        </p>
      )}

      {summary && !notConfigured && (
        <div className="mt-3 rounded-lg border bg-muted/40 p-4 text-left">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Summary
          </p>
          <ul className="mt-2 space-y-1.5">
            {summary.map((point, i) => (
              <li key={i} className="text-sm leading-relaxed">
                <span className="mr-1.5 text-muted-foreground">•</span>
                {point}
              </li>
            ))}
          </ul>
          {actions.length > 0 && (
            <>
              <p className="mt-4 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <ListChecks className="h-3.5 w-3.5" />
                Next steps
              </p>
              <ul className="mt-2 space-y-1.5">
                {actions.map((action, i) => (
                  <li key={i} className="text-sm leading-relaxed">
                    <span className="mr-1.5 text-muted-foreground">•</span>
                    {action}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  )
}
