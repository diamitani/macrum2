"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CloudUpload, Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import type { MacrumRecordType } from "@/lib/twenty"

/** Full local record (extra fields are sent through to the sync route as-is). */
export interface TwentySyncRecord {
  id: string
  name: string
  twentyId?: string
}

interface TwentySyncButtonProps<T extends TwentySyncRecord = TwentySyncRecord> {
  type: MacrumRecordType
  record: T
  /** Called with the Twenty record id after a successful sync so the caller can persist it. */
  onSynced?: (twentyId: string) => void
  size?: "sm" | "default" | "lg" | "icon"
  className?: string
}

interface SyncError {
  error?: string
  hint?: string
}

/**
 * "Sync to Twenty" button. Sends the full local record to POST /api/twenty/sync
 * (local data lives in localStorage, so the server never reads client state).
 * On success the returned twentyId is handed to `onSynced` for persistence.
 */
export function TwentySyncButton<T extends TwentySyncRecord = TwentySyncRecord>({
  type,
  record,
  onSynced,
  size = "sm",
  className,
}: TwentySyncButtonProps<T>) {
  const [isSyncing, setIsSyncing] = useState(false)

  const handleSync = async () => {
    setIsSyncing(true)
    try {
      const res = await fetch("/api/twenty/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, record }),
      })
      const data = (await res.json().catch(() => ({}))) as SyncError & { twentyId?: string }

      if (res.status === 503) {
        toast({
          title: "Twenty not connected",
          description: data.hint ?? "Set TWENTY_API_KEY in your server environment, then try again.",
          variant: "destructive",
        })
        return
      }
      if (!res.ok || !data.twentyId) {
        throw new Error(data.error ?? `Sync failed (HTTP ${res.status})`)
      }
      onSynced?.(data.twentyId)
      toast({
        title: "Synced to Twenty",
        description: `"${record.name}" is now in sync.`,
      })
    } catch (error) {
      toast({
        title: "Sync failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      })
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <Button
      variant="outline"
      size={size}
      className={className}
      onClick={handleSync}
      disabled={isSyncing}
    >
      {isSyncing ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <CloudUpload className="mr-2 h-4 w-4" />
      )}
      {isSyncing ? "Syncing..." : record.twentyId ? "Re-sync to Twenty" : "Sync to Twenty"}
    </Button>
  )
}
