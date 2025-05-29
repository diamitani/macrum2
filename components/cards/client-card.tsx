"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Mail, Phone, Building2, MoreVertical, Edit, Trash2 } from "lucide-react"
import { ClientForm } from "@/components/forms/client-form"
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog"
import { useClients } from "@/context/client-context"
import { useProjects } from "@/context/project-context"
import { useBusinesses } from "@/context/business-context"
import { format } from "date-fns"

interface Client {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  address?: string
  status: "active" | "prospect" | "inactive"
  businessIds: string[]
  projectIds: string[]
  notes?: string
  createdAt: string
  updatedAt: string
}

interface ClientCardProps {
  client: Client
}

export function ClientCard({ client }: ClientCardProps) {
  const { deleteClient } = useClients()
  const { projects } = useProjects()
  const { businesses } = useBusinesses()

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const clientProjects = projects.filter((project) => client.projectIds.includes(project.id))
  const clientBusinesses = businesses.filter((business) => client.businessIds.includes(business.id))

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "prospect":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const handleDelete = async () => {
    try {
      await deleteClient(client.id)
      setIsDeleteDialogOpen(false)
    } catch (error) {
      console.error("Failed to delete client:", error)
    }
  }

  return (
    <>
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                  {getInitials(client.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{client.name}</h3>
                {client.company && <p className="text-sm text-gray-600 truncate">{client.company}</p>}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={getStatusColor(client.status)}>
                {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)} className="text-red-600">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Contact Information */}
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">{client.email}</span>
            </div>
            {client.phone && (
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>{client.phone}</span>
              </div>
            )}
          </div>

          {/* Business Associations */}
          {clientBusinesses.length > 0 && (
            <div>
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <Building2 className="w-4 h-4 mr-2" />
                <span>Businesses ({clientBusinesses.length})</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {clientBusinesses.slice(0, 2).map((business) => (
                  <Badge key={business.id} variant="outline" className="text-xs">
                    {business.name}
                  </Badge>
                ))}
                {clientBusinesses.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{clientBusinesses.length - 2} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Project Information */}
          <div>
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Projects: {clientProjects.length}</span>
              <span>Created: {format(new Date(client.createdAt), "MMM dd, yyyy")}</span>
            </div>
            {clientProjects.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {clientProjects.slice(0, 2).map((project) => (
                  <Badge key={project.id} variant="secondary" className="text-xs">
                    {project.name}
                  </Badge>
                ))}
                {clientProjects.length > 2 && (
                  <Badge variant="secondary" className="text-xs">
                    +{clientProjects.length - 2} more
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Notes Preview */}
          {client.notes && (
            <div className="pt-2 border-t">
              <p className="text-sm text-gray-600 line-clamp-2">{client.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
          </DialogHeader>
          <ClientForm client={client} onSuccess={() => setIsEditDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete Client"
        description={`Are you sure you want to delete "${client.name}"? This action cannot be undone.`}
      />
    </>
  )
}
