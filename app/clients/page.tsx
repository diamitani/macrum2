"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Search, Building2 } from "lucide-react"
import { ClientCard } from "@/components/client-card"

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  // Filter clients based on search query and active tab
  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.contactName.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = activeTab === "all" || client.status === activeTab

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground">Manage your client relationships</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search clients..."
              className="w-full pl-8 md:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Client
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Clients</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          {clients.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredClients.map((client) => (
                <ClientCard key={client.id} client={client} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-8">
                <Building2 className="h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No clients yet</h3>
                <p className="mt-2 text-center text-sm text-muted-foreground">
                  Add your first client to start managing your relationships
                </p>
                <Button className="mt-4">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Your First Client
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="active" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredClients
              .filter((client) => client.status === "active")
              .map((client) => (
                <ClientCard key={client.id} client={client} />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="inactive" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredClients
              .filter((client) => client.status === "inactive")
              .map((client) => (
                <ClientCard key={client.id} client={client} />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
