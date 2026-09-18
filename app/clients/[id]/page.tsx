"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Building2, Mail, Phone, MapPin, Calendar, Pencil, Trash2 } from "lucide-react"
import { ProjectList } from "@/components/project-list"
import { useClientContext } from "@/context/client-context"
import { useBusinesses } from "@/context/business-context"
import { TwentySyncButton } from "@/components/twenty-sync-button"
import { TwentyBadge } from "@/components/twenty-badge"
import { FollowupDialog } from "@/components/ai/followup-dialog"

export default function ClientDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const { getClientById, deleteClient, isLoading, updateClient } = useClientContext()
  const { businesses } = useBusinesses()
  const [deleting, setDeleting] = useState(false)

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading client...</div>
      </div>
    )
  }

  const client = getClientById(id)

  if (!client) {
    return (
      <div className="space-y-6">
        <Button variant="outline" asChild>
          <Link href="/clients">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Clients
          </Link>
        </Button>
        <div className="flex flex-col items-center justify-center p-8 border rounded-lg">
          <h3 className="text-lg font-medium">Client not found</h3>
          <p className="mt-2 text-sm text-muted-foreground">This client may have been deleted.</p>
        </div>
      </div>
    )
  }

  const business = businesses.find((b) => b.id === client.businessId)

  const handleDelete = async () => {
    if (!confirm(`Delete client "${client.name}"?`)) return
    setDeleting(true)
    deleteClient(id)
    router.push("/clients")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" asChild>
            <Link href="/clients" aria-label="Back to Clients">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight">{client.name}</h1>
              <TwentyBadge twentyId={client.twentyId} />
            </div>
            <p className="text-muted-foreground">
              {[client.company, business?.name].filter(Boolean).join(" · ") || client.email}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <FollowupDialog recordType="contact" name={client.name} context={client.notes} />
          <TwentySyncButton
            type="person"
            record={client}
            onSynced={(twentyId) => updateClient(id, { twentyId })}
          />
          <Button variant="outline" asChild>
            <Link href={`/clients/${id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </Link>
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
            <Trash2 className="mr-2 h-4 w-4" />
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Contact information</CardTitle>
            <CardDescription>How to reach this client</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center text-sm">
              <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>{client.email}</span>
            </div>
            {client.phone && (
              <div className="flex items-center text-sm">
                <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{client.phone}</span>
              </div>
            )}
            {client.address && (
              <div className="flex items-center text-sm">
                <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{client.address}</span>
              </div>
            )}
            <div className="flex items-center text-sm">
              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>Client since {new Date(client.createdAt).toLocaleDateString()}</span>
            </div>
            {(business || client.company) && (
              <div className="flex items-center text-sm">
                <Building2 className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{business?.name ?? client.company}</span>
              </div>
            )}
            {client.notes && (
              <p className="rounded-md border bg-muted/50 p-3 text-sm">{client.notes}</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="projects">
        <TabsList>
          <TabsTrigger value="projects">Projects</TabsTrigger>
        </TabsList>
        <TabsContent value="projects" className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Client projects</h2>
            <Button asChild>
              <Link href="/projects/new">New Project</Link>
            </Button>
          </div>
          <ProjectList clientId={client.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
