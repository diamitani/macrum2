"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle, Search, Users, Pencil, Trash2 } from "lucide-react"
import { useClientContext } from "@/context/client-context"
import { TwentyBadge } from "@/components/twenty-badge"
import { toast } from "@/components/ui/use-toast"

interface ContactFormState {
  name: string
  email: string
  phone: string
  company: string
  address: string
  notes: string
}

const EMPTY_FORM: ContactFormState = {
  name: "",
  email: "",
  phone: "",
  company: "",
  address: "",
  notes: "",
}

/**
 * Contacts page — the people directory. Wired to the Client context
 * (`macrum_clients`), the same store behind the Clients page.
 */
export default function ContactsPage() {
  const { clients, isLoading, addClient, updateClient, deleteClient } = useClientContext()
  const [searchQuery, setSearchQuery] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<ContactFormState>(EMPTY_FORM)

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return clients
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.phone ?? "").toLowerCase().includes(q) ||
        (c.company ?? "").toLowerCase().includes(q)
    )
  }, [clients, searchQuery])

  const openNew = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setDialogOpen(true)
  }

  const openEdit = (id: string) => {
    const c = clients.find((x) => x.id === id)
    if (!c) return
    setEditingId(id)
    setForm({
      name: c.name,
      email: c.email,
      phone: c.phone ?? "",
      company: c.company ?? "",
      address: c.address ?? "",
      notes: c.notes ?? "",
    })
    setDialogOpen(true)
  }

  const handleSave = () => {
    if (!form.name.trim() || !form.email.trim()) {
      toast({
        title: "Name and email are required",
        variant: "destructive",
      })
      return
    }
    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || undefined,
      company: form.company.trim() || undefined,
      address: form.address.trim() || undefined,
      notes: form.notes.trim() || undefined,
    }
    if (editingId) {
      updateClient(editingId, payload)
      toast({ title: "Contact updated" })
    } else {
      addClient(payload)
      toast({ title: "Contact added" })
    }
    setDialogOpen(false)
  }

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Delete contact "${name}"?`)) return
    deleteClient(id)
    toast({ title: "Contact deleted" })
  }

  const set = (k: keyof ContactFormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
          <p className="text-muted-foreground">Manage all your contacts across different businesses</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search contacts..."
              className="w-full pl-8 md:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={openNew}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Contact
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Contacts ({filtered.length})</CardTitle>
          <CardDescription>View and manage all your contacts in one place</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Loading contacts...</p>
          ) : filtered.length === 0 ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-center">
                <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No contacts yet</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Add contacts to keep track of clients and team members
                </p>
                <Button className="mt-4" onClick={openNew}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Your First Contact
                </Button>
              </div>
            </div>
          ) : (
            <ul className="divide-y">
              {filtered.map((c) => (
                <li key={c.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium">{c.name}</p>
                      <TwentyBadge twentyId={c.twentyId} />
                    </div>
                    <p className="truncate text-xs text-muted-foreground">
                      {[c.email, c.phone, c.company].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(c.id)} aria-label={`Edit ${c.name}`}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(c.id, c.name)}
                      aria-label={`Delete ${c.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit contact" : "Add contact"}</DialogTitle>
            <DialogDescription>
              {editingId ? "Update this contact's details." : "Add someone to your contacts."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="contact-name">Name *</Label>
              <Input id="contact-name" value={form.name} onChange={set("name")} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contact-email">Email *</Label>
              <Input id="contact-email" type="email" value={form.email} onChange={set("email")} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="contact-phone">Phone</Label>
                <Input id="contact-phone" value={form.phone} onChange={set("phone")} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contact-company">Company</Label>
                <Input id="contact-company" value={form.company} onChange={set("company")} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contact-address">Address</Label>
              <Input id="contact-address" value={form.address} onChange={set("address")} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contact-notes">Notes</Label>
              <Textarea id="contact-notes" value={form.notes} onChange={set("notes")} rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>{editingId ? "Save changes" : "Add contact"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
