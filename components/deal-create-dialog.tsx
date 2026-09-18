"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDeals } from "@/context/deal-context"
import { useBusinesses } from "@/context/business-context"
import { useClientContext } from "@/context/client-context"
import { DEAL_STAGES, type DealStage } from "@/types/deal"

interface DealCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DealCreateDialog({ open, onOpenChange }: DealCreateDialogProps) {
  const { addDeal } = useDeals()
  const { businesses } = useBusinesses()
  const { clients } = useClientContext()

  const [name, setName] = useState("")
  const [amount, setAmount] = useState("")
  const [currency, setCurrency] = useState("USD")
  const [stage, setStage] = useState<DealStage>("lead")
  const [companyId, setCompanyId] = useState<string>("")
  const [contactId, setContactId] = useState<string>("")
  const [closeDate, setCloseDate] = useState("")
  const [saving, setSaving] = useState(false)

  const reset = () => {
    setName("")
    setAmount("")
    setCurrency("USD")
    setStage("lead")
    setCompanyId("")
    setContactId("")
    setCloseDate("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const deal = await addDeal({
      name: name.trim(),
      amount: Number(amount) || 0,
      currency: currency.trim() || "USD",
      stage,
      companyId: companyId || undefined,
      contactId: contactId || undefined,
      closeDate: closeDate || undefined,
    })
    setSaving(false)
    if (deal) {
      reset()
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>New Deal</DialogTitle>
          <DialogDescription>Add a new deal to your pipeline.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="deal-name">Deal name *</Label>
            <Input
              id="deal-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Website redesign"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="deal-amount">Amount</Label>
              <Input
                id="deal-amount"
                type="number"
                min="0"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deal-currency">Currency</Label>
              <Input
                id="deal-currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value.toUpperCase())}
                placeholder="USD"
                maxLength={3}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="deal-stage">Stage</Label>
              <Select value={stage} onValueChange={(v) => setStage(v as DealStage)}>
                <SelectTrigger id="deal-stage">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DEAL_STAGES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
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
                value={closeDate}
                onChange={(e) => setCloseDate(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="deal-company">Company</Label>
              <Select
                value={companyId || "none"}
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
              <Select value={contactId || "none"} onValueChange={(v) => setContactId(v === "none" ? "" : v)}>
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
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving || !name.trim()}>
              {saving ? "Creating..." : "Create Deal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
