"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Bot, Settings } from "lucide-react"

/**
 * Graceful fallback shown by every AI surface when no AI_API_KEY is set.
 * Never blocks the app — just explains the setup step.
 */
export function AiNotConfigured({ compact = false }: { compact?: boolean }) {
  return (
    <Card className={compact ? "" : "border-dashed"}>
      <CardContent className={compact ? "p-4" : "p-6"}>
        <div className="flex items-start gap-3">
          <div className="rounded-md bg-muted p-2">
            <Bot className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">AI not configured</p>
            <p className="text-sm text-muted-foreground">
              Add <code className="rounded bg-muted px-1.5 py-0.5 text-xs">AI_API_KEY</code> to your
              server environment to turn on this feature.{" "}
              <span className="inline-flex items-center gap-1">
                <Settings className="h-3 w-3" />
                Optional: <code className="rounded bg-muted px-1.5 py-0.5 text-xs">AI_API_BASE_URL</code> and{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs">AI_MODEL</code>.
              </span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
