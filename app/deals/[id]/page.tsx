"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, PlusCircle, Trash2 } from "lucide-react"
import { useDeals } from "@/context/deal-context"
import { useBusinesses } from "@/context/business-context"
import { useClientContext } from "@/context/client-context"
import { DEAL_STAGES, formatDealAmount, type DealStage } from "@/types/deal"
import { TwentySyncButton } from "@/components/twenty-sync-button"
import { TwentyBadge } from "@/components/twenty-badge"
import { FollowupDialog } from "@/components/ai/followup-dialog"

export default function DealDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const { deals, isLoading, updateDeal, deleteDeal, addDealActivity } = useDeals()
  const { businesses } = useBusinesses()
  const { clients } = useClientContext()

  const deal = deals.find((d) => d.id === id)

  const [name, setName] = useState<string | null>(null)
  const [amount, setAmount] = useState<string | null>(null)
  const [currency, setCurrency] = useState<string | null>(null)
  const [stage, setStage] = useState<DealStage | null>(null)
  const [companyId, setCompanyId] = useState<string | null>(null)
  const [contactId, setContactId] = useState<string | null>(null)
  const [closeDate, setCloseDate] = useState<string | null>(null)
  const [notes, setNotes] = useState<string | null>(null)
  const [noteInput, setNoteInput] = useState("")
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // Initialize form state from the loaded deal (lazy, once loaded)
  const cur = {
    name: name ?? deal?.name ?? "",
    amount: amount ?? (deal ? String(deal.amount) : ""),
    currency: currency ?? deal?.currency ?? "USD",
    stage: stage ?? deal?.stage ?? "lead",
    companyId: companyId ?? deal?.companyId ?? "",
    contactId: contactId ?? deal?.contactId ?? "",
    closeDate: closeDate ?? deal?.closeDate ?? "",
    notes: notes ?? deal?.notes ?? "",
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading deal...</div>
      </div>
    )
  }

  if (!deal) {
    return (
      <div className="space-y-6">
        <Button variant="outline" asChild>
          <Link href="/deals">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Deals
          </Link>
        </Button>
        <div className="flex flex-col items-center justify-center p-8 border rounded-lg">
          <h3 className="text-lg font-medium">Deal not found</h3>
          <p className="mt-2 text-sm text-muted-foreground">This deal may have been deleted.</p>
        </div>
      </div>
    )
  }

  const handleSave = async () => {
    setSaving(true)
    const updated = await updateDeal(id, {
      name: cur.name.trim(),
      amount: Number(cur.amount) || 0,
      currency: cur.currency.trim() || "USD",
      stage: cur.stage,
      companyId: cur.companyId || undefined,
      contactId: cur.contactId || undefined,
      closeDate: cur.closeDate || undefined,
      notes: cur.notes.trim() || undefined,
    })
    setSaving(false)
    if (updated) {
      setName(null); setAmount(null); setCurrency(null); setStage(null)
      setCompanyId(null); setContactId(null); setCloseDate(null); setNotes(null)
    }
  }

  const handleDelete = async () => {
    if (!confirm(`Delete deal "${deal.name}"?`)) return
    setDeleting(true)
    const ok = await deleteDeal(id)
    setDeleting(false)
    if (ok) router.push("/deals")
  }

  const handleAddNote = async () => {
    if (!noteInput.trim()) return
    const activity = await addDealActivity(id, noteInput)
    if (activity) setNoteInput("")
  }

  const company = businesses.find((b) => b.id === deal.companyId)
  const contact = clients.find((c) => c.id === deal.contactId)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" asChild>
            <Link href="/deals" aria-label="Back to Deals">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{deal.name}</h1>
            <p className="text-muted-foreground">
              {formatDealAmount(deal.amount, deal.currency)} · {DEAL_STAGES.find((s) => s.value === deal.stage)?.label}
            </p>
            <div className="mt-1.5">
              <TwentyBadge twentyId={deal.twentyId} />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <FollowupDialog recordType="deal" name={deal.name} context={deal.notes} />
          <TwentySyncButton
            type="opportunity"
            record={deal}
            onSynced={(twentyId) => updateDeal(id, { twentyId })}
          />
          <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
            <Trash2 className="mr-2 h-4 w-4" />
            {deleting ? "Deleting..." : "Delete"}
          </Button>
          <Button onClick={handleSave} disabled={saving || !cur.name.trim()}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Deal details</CardTitle>
            <CardDescription>Edit the core fields for this deal.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="deal-name">Deal name *</Label>
              <Input id="deal-name" value={cur.name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="deal-amount">Amount</Label>
                <Input
                  id="deal-amount"
                  type="number"
                  min="0"
                  step="any"
                  value={cur.amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deal-currency">Currency</Label>
                <Input
                  id="deal-currency"
                  value={cur.currency}
                  onChange={(e) => setCurrency(e.target.value.toUpperCase())}
                  maxLength={3}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="deal-stage">Stage</Label>
                <Select value={cur.stage} onValueChange={(v) => setStage(v as DealStage)}>
                  <SelectTrigger id="deal-stage">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DEAL_STAGES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label} ({Math.round(s.weight * 100)}%)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="deal-close-date">Close date</Label>
                <Input
                  id="deal-close-date"
                  type="date"
                  value={cur.closeDate}
                  onChange={(e) => setCloseDate(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="deal-notes">Notes</Label>
              <Textarea
                id="deal-notes"
                value={cur.notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="Deal background, terms, open items..."
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Linked records</CardTitle>
              <CardDescription>
                {company || contact
                  ? `Linked to ${company?.name ?? "a company"}${contact ? ` and ${contact.name}` : ""}.`
                  : "No company or contact linked yet."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="deal-company">Company</Label>
                <Select
                  value={cur.companyId || "none"}
                  onValueChange={(v) => setCompanyId(v === "none" ? "" : v)}
                >
                  <SelectTrigger id="deal-company">
                    <SelectValue placeholder="Select company" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {businesses.map((b) => (
                      <SelectItem key={b.id} value={b.id}>
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="deal-contact">Contact</Label>
                <Select
                  value={cur.contactId || "none"}
                  onValueChange={(v) => setContactId(v === "none" ? "" : v)}
                >
                  <SelectTrigger id="deal-contact">
                    <SelectValue placeholder="Select contact" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {clients.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity notes</CardTitle>
              <CardDescription>Append-only log — entries cannot be edited or removed.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="Add a note about this deal..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddNote()
                  }}
                />
                <Button onClick={handleAddNote} disabled={!noteInput.trim()}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add
                </Button>
              </div>
              {(!deal.activities || deal.activities.length === 0) ? (
                <p className="text-sm text-muted-foreground">No activity yet. Add the first note above.</p>
              ) : (
                <ul className="space-y-3">
                  {[...deal.activities]
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((a) => (
                      <li key={a.id} className="rounded-md border p-3">
                        <p className="text-sm">{a.text}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {new Date(a.createdAt).toLocaleString()}
                        </p>
                      </li>
                    ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
