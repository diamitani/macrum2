"use client"

import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Cloud, Loader2, RefreshCw, Terminal, Download, Upload, Database } from "lucide-react"

interface TwentyStatus {
  configured: boolean
  baseUrl: string
  ok?: boolean
  companiesCount?: number | null
  error?: string
  hint?: string
}

function TwentyIntegrationCard() {
  const [status, setStatus] = useState<TwentyStatus | null>(null)
  const [isChecking, setIsChecking] = useState(true)

  const checkStatus = useCallback(async () => {
    setIsChecking(true)
    try {
      const res = await fetch("/api/twenty/status")
      const data = (await res.json()) as TwentyStatus
      setStatus(data)
    } catch {
      setStatus({
        configured: false,
        baseUrl: "https://api.twenty.com",
        error: "Could not reach the status endpoint.",
      })
    } finally {
      setIsChecking(false)
    }
  }, [])

  useEffect(() => {
    void checkStatus()
  }, [checkStatus])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <Cloud className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Twenty CRM</CardTitle>
              <CardDescription>Sync companies, people, and opportunities with your Twenty workspace</CardDescription>
            </div>
          </div>
          {isChecking ? (
            <Badge variant="secondary">
              <Loader2 className="mr-1 h-3 w-3 animate-spin" /> Checking
            </Badge>
          ) : status?.configured && status.ok ? (
            <Badge className="border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
              Connected
            </Badge>
          ) : (
            <Badge variant="secondary">Not connected</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm">
          <span className="font-medium">Base URL:</span>{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
            {status?.baseUrl ?? "https://api.twenty.com"}
          </code>
        </div>

        {!isChecking && !status?.configured && (
          <Alert>
            <Terminal className="h-4 w-4" />
            <AlertTitle>Connect your Twenty API key</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>
                {status?.hint ??
                  "Set TWENTY_API_KEY as a server environment variable, then redeploy."}
              </p>
              <p className="text-xs">
                The key lives only in your server environment — it is never shown here, stored in the
                browser, or committed to git.
              </p>
            </AlertDescription>
          </Alert>
        )}

        {!isChecking && status?.configured && status.ok === false && (
          <Alert variant="destructive">
            <AlertTitle>Connection failed</AlertTitle>
            <AlertDescription>{status.error}</AlertDescription>
          </Alert>
        )}

        {!isChecking && status?.configured && status.ok && (
          <p className="text-sm text-muted-foreground">
            Twenty responded successfully
            {typeof status.companiesCount === "number" ? ` (${status.companiesCount} companies in workspace)` : ""}.
          </p>
        )}

        <Button variant="outline" size="sm" onClick={checkStatus} disabled={isChecking}>
          {isChecking ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          {isChecking ? "Testing..." : "Test connection"}
        </Button>
      </CardContent>
    </Card>
  )
}

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your workspace settings and integrations</p>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold">Integrations</h2>
        <TwentyIntegrationCard />
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold">Data</h2>
        <DataBackupCard />
      </div>
    </div>
  )
}

/** All client-side store keys that participate in backup/restore. */
const STORE_KEYS = [
  "macrum_auth",
  "macrum_user",
  "macrum_businesses",
  "macrum_projects",
  "macrum_clients",
  "macrum_tasks",
  "macrum_deals",
  "macrum_notes",
] as const

function DataBackupCard() {
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null)

  const handleExport = useCallback(() => {
    setIsExporting(true)
    setMessage(null)
    try {
      const data: Record<string, unknown> = {}
      for (const key of STORE_KEYS) {
        const raw = localStorage.getItem(key)
        if (raw != null) {
          try {
            data[key] = JSON.parse(raw)
          } catch {
            data[key] = raw
          }
        }
      }
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const date = new Date().toISOString().slice(0, 10) // YYYY-MM-DD
      const a = document.createElement("a")
      a.href = url
      a.download = `macrum-backup-${date}.json`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      setMessage({ kind: "ok", text: `Backup downloaded as macrum-backup-${date}.json` })
    } catch {
      setMessage({ kind: "error", text: "Export failed — please try again." })
    } finally {
      setIsExporting(false)
    }
  }, [])

  const mergeById = useCallback((existing: unknown, incoming: unknown): unknown => {
    if (Array.isArray(incoming)) {
      const base = Array.isArray(existing) ? existing : []
      const items = [...base, ...incoming]
      // Deduplicate by id — incoming records win. Items without an id are kept as-is.
      const seen = new Map<string, unknown>()
      const noId: unknown[] = []
      for (const item of items) {
        if (item && typeof item === "object" && "id" in item && (item as { id: unknown }).id != null) {
          seen.set(String((item as { id: unknown }).id), item)
        } else {
          noId.push(item)
        }
      }
      return [...seen.values(), ...noId]
    }
    if (incoming && typeof incoming === "object" && existing && typeof existing === "object") {
      return { ...(existing as object), ...(incoming as object) }
    }
    return incoming
  }, [])

  const handleImportFile = useCallback(
    (file: File) => {
      setIsImporting(true)
      setMessage(null)
      const reader = new FileReader()
      reader.onload = () => {
        try {
          const parsed = JSON.parse(String(reader.result)) as Record<string, unknown>
          let restored = 0
          for (const key of STORE_KEYS) {
            if (!(key in parsed)) continue
            const raw = localStorage.getItem(key)
            let current: unknown = null
            if (raw != null) {
              try {
                current = JSON.parse(raw)
              } catch {
                current = null
              }
            }
            const merged = mergeById(current, parsed[key])
            localStorage.setItem(key, JSON.stringify(merged))
            restored += 1
          }
          setMessage({
            kind: "ok",
            text: `Imported ${restored} store${restored === 1 ? "" : "s"} (merged by id). Reload the app to see restored records.`,
          })
        } catch {
          setMessage({ kind: "error", text: "That file is not a valid Macrum backup." })
        } finally {
          setIsImporting(false)
        }
      }
      reader.onerror = () => {
        setMessage({ kind: "error", text: "Could not read the selected file." })
        setIsImporting(false)
      }
      reader.readAsText(file)
    },
    [mergeById]
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>Data backup</CardTitle>
            <CardDescription>
              Export everything stored in this browser, or import a previous backup (merged by id)
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExport} disabled={isExporting}>
            <Download className="mr-2 h-4 w-4" />
            {isExporting ? "Exporting..." : "Export backup"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={isImporting}
            onClick={() => document.getElementById("macrum-backup-import")?.click()}
          >
            <Upload className="mr-2 h-4 w-4" />
            {isImporting ? "Importing..." : "Import backup"}
          </Button>
          <input
            id="macrum-backup-import"
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              e.target.value = ""
              if (file) handleImportFile(file)
            }}
          />
        </div>
        {message && (
          <p
            className={
              message.kind === "ok"
                ? "text-sm text-emerald-700 dark:text-emerald-400"
                : "text-sm text-destructive"
            }
          >
            {message.text}
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          Backup includes companies, projects, tasks, deals, clients, contacts, notebook, and user
          settings. Import adds missing records and updates existing ones by id — nothing is deleted.
        </p>
      </CardContent>
    </Card>
  )
}
