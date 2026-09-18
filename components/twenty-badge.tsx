"use client"

import { Badge } from "@/components/ui/badge"
import { AlertCircle, Check, CloudOff } from "lucide-react"
import { cn } from "@/lib/utils"

interface TwentyBadgeProps {
  /** Twenty record id — presence means the local record is linked to Twenty. */
  twentyId?: string | null
  /** Optional sync state for a failed attempt. */
  syncFailed?: boolean
  className?: string
}

/**
 * Shows Twenty sync state for a record: synced (has twentyId), not synced,
 * or failed. Never touches the API key — purely presentational.
 */
export function TwentyBadge({ twentyId, syncFailed, className }: TwentyBadgeProps) {
  if (syncFailed) {
    return (
      <Badge variant="destructive" className={cn("gap-1", className)}>
        <AlertCircle className="h-3 w-3" />
        Sync failed
      </Badge>
    )
  }
  if (twentyId) {
    return (
      <Badge
        variant="outline"
        className={cn(
          "gap-1 border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
          className,
        )}
      >
        <Check className="h-3 w-3" />
        Synced to Twenty
      </Badge>
    )
  }
  return (
    <Badge variant="secondary" className={cn("gap-1", className)}>
      <CloudOff className="h-3 w-3" />
      Not synced
    </Badge>
  )
}
