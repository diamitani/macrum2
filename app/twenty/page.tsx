"use client"

import { useCallback, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Building2, CloudOff, Download, Loader2, Terminal, Users, Handshake } from "lucide-react"
import { useBusinesses } from "@/context/business-context"
import { useClientContext } from "@/context/client-context"
import { useDeals } from "@/context/deal-context"
import { TwentyBadge } from "@/components/twenty-badge"
import { toast } from "@/hooks/use-toast"
import type { MacrumRecordType } from "@/lib/twenty"

const TABS: { value: MacrumRecordType; plural: string; label: string; icon: typeof Users }[] = [
  { value: "company", plural: "companies", label: "Companies", icon: Building2 },
  { value: "person", plural: "people", label: "People", icon: Users },
  { value: "opportunity", plural: "opportunities", label: "Opportunities", icon: Handshake },
]

interface TwentyRecord {
  twentyId: string
  name: string
  email?: string
  website?: string
  phone?: string
  amount?: number
  currency?: string
  stage?: string
  companyName?: string
}

interface LocalRow {
  id: string
  name: string
  sub?: string
  twentyId?: string
}

export default function TwentyPage() {
  const { businesses } = useBusinesses()
  const { clients } = useClientContext()
  const { deals } = useDeals()

  const [activeTab, setActiveTab] = useState<MacrumRecordType>("company")
  const [twentyData, setTwentyData] = useState<Record<string, TwentyRecord[]>>({})
  const [totalCounts, setTotalCounts] = useState<Record<string, number>>({})
  const [isPulling, setIsPulling] = useState(false)
  const [noKey, setNoKey] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const pull = useCallback(async (type: MacrumRecordType) => {
    setIsPulling(true)
    setError(null)
    try {
      const res = await fetch("/api/twenty/pull", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, limit: 100 }),
      })
      const data = await res.json()
      if (res.status === 503) {
        setNoKey(true)
        setTwentyData((p) => ({ ...p, [type]: [] }))
        return
      }
      if (!res.ok) throw new Error(data.error ?? `Pull failed (HTTP ${res.status})`)
      setNoKey(false)
      setTwentyData((p) => ({ ...p, [type]: data.records ?? [] }))
      setTotalCounts((p) => ({ ...p, [type]: data.totalCount ?? 0 }))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
      toast({
        title: "Pull failed",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      })
    } finally {
      setIsPulling(false)
    }
  }, [])

  const localRows: Record<MacrumRecordType, LocalRow[]> = {
    company: businesses.map((b) => ({
      id: b.id,
      name: b.name,
      sub: b.website ?? b.industry,
      twentyId: b.twentyId,
    })),
    person: clients.map((c) => ({
      id: c.id,
      name: c.name,
      sub: c.email,
      twentyId: c.twentyId,
    })),
    opportunity: deals.map((d) => ({
      id: d.id,
      name: d.name,
      sub: `${d.currency ?? "USD"} ${(d.amount ?? 0).toLocaleString()} · ${d.stage}`,
      twentyId: d.twentyId,
    })),
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Twenty CRM</h1>
          <p className="text-muted-foreground">
            Compare local records with your Twenty workspace, side by side
          </p>
        </div>
        <Button
          onClick={() => pull(activeTab)}
          disabled={isPulling}
          variant="outline"
        >
          {isPulling ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          {isPulling ? "Pulling..." : "Pull from Twenty"}
        </Button>
      </div>

      {noKey && (
        <Alert>
          <Terminal className="h-4 w-4" />
          <AlertTitle>Connect your Twenty API key</AlertTitle>
          <AlertDescription>
            Set <code className="rounded bg-muted px-1.5 py-0.5 text-xs">TWENTY_API_KEY</code> (and
            optionally <code className="rounded bg-muted px-1.5 py-0.5 text-xs">TWENTY_API_URL</code>)
            as server environment variables, then redeploy. Get a key in Twenty under Settings →
            API &amp; Webhooks → + Create key.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as MacrumRecordType)}
        className="space-y-4"
      >
        <TabsList>
          {TABS.map((t) => (
            <TabsTrigger key={t.value} value={t.value}>
              <t.icon className="mr-2 h-4 w-4" />
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {TABS.map((t) => {
          const locals = localRows[t.value]
          const remotes = twentyData[t.value]
          return (
            <TabsContent key={t.value} value={t.value} className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Local ({locals.length})</CardTitle>
                    <CardDescription>Records in Macrum (browser storage)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {locals.length === 0 ? (
                      <p className="py-6 text-center text-sm text-muted-foreground">
                        No local {t.label.toLowerCase()} yet.
                      </p>
                    ) : (
                      <ul className="divide-y">
                        {locals.map((row) => (
                          <li key={row.id} className="flex items-center justify-between gap-3 py-2.5">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium">{row.name}</p>
                              {row.sub && (
                                <p className="truncate text-xs text-muted-foreground">{row.sub}</p>
                              )}
                            </div>
                            <TwentyBadge twentyId={row.twentyId} />
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>
                      Twenty {typeof totalCounts[t.value] === "number" ? `(${totalCounts[t.value]})` : ""}
                    </CardTitle>
                    <CardDescription>
                      {remotes
                        ? "Records pulled from your Twenty workspace"
                        : "Press “Pull from Twenty” to load records"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!remotes ? (
                      <div className="flex flex-col items-center py-8 text-center">
                        <CloudOff className="h-10 w-10 text-muted-foreground" />
                        <p className="mt-3 text-sm text-muted-foreground">
                          Nothing pulled yet. Use the pull button above to fetch records.
                        </p>
                      </div>
                    ) : remotes.length === 0 ? (
                      <p className="py-6 text-center text-sm text-muted-foreground">
                        {noKey
                          ? "Twenty is not connected — connect a key to pull records."
                          : "No records found in Twenty."}
                      </p>
                    ) : (
                      <ul className="divide-y">
                        {remotes.map((r) => {
                          const linked = locals.some((l) => l.twentyId === r.twentyId)
                          return (
                            <li key={r.twentyId} className="flex items-center justify-between gap-3 py-2.5">
                              <div className="min-w-0">
                                <p className="truncate text-sm font-medium">{r.name}</p>
                                <p className="truncate text-xs text-muted-foreground">
                                  {[r.email, r.website, r.companyName]
                                    .filter(Boolean)
                                    .join(" · ") || r.twentyId}
                                </p>
                              </div>
                              {linked ? (
                                <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                                  Linked
                                </Badge>
                              ) : (
                                <Badge variant="secondary">Unlinked</Badge>
                              )}
                            </li>
                          )
                        })}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}
