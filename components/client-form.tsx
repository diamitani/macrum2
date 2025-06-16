
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { useClientContext } from "@/context/client-context"
import { useBusinesses } from "@/context/business-context"

interface ClientFormProps {
  clientId?: string
  onCancel?: () => void
}

export function ClientForm({ clientId, onCancel }: ClientFormProps) {
  const router = useRouter()
  const { getClientById, addClient, updateClient } = useClientContext()
  const { businesses } = useBusinesses()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    businessId: "",
  })

  // If editing, load the client data
  useEffect(() => {
    if (clientId) {
      const client = getClientById(clientId)
      if (client) {
        setFormData({
          name: client.name,
          email: client.email || "",
          phone: client.phone || "",
          address: client.address || "",
          businessId: client.businessId || "",
        })
      }
    }
  }, [clientId, getClientById])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Client name is required.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    try {
      if (clientId) {
        // Update existing client
        updateClient(clientId, formData)
        router.push(`/clients/${clientId}`)
      } else {
        // Create new client
        const newClient = addClient(formData)
        router.push(`/clients/${newClient.id}`)
      }
    } catch (error) {
      console.error("Error saving client:", error)
      toast({
        title: "Error",
        description: "Failed to save client. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{clientId ? "Edit Client" : "Create New Client"}</CardTitle>
        <CardDescription>
          {clientId ? "Update client details" : "Add a new client to your ModularCRM"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="required">
              Client Name
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter client name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessId">Business</Label>
            <Select value={formData.businessId} onValueChange={(value) => handleSelectChange("businessId", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select business (optional)" />
              </SelectTrigger>
              <SelectContent>
                {businesses.map((business) => (
                  <SelectItem key={business.id} value={business.id}>
                    {business.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="client@example.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              placeholder="(123) 456-7890"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              name="address"
              placeholder="Enter client address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            type="button"
            onClick={onCancel || (() => router.push("/clients"))}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {clientId ? "Updating..." : "Creating..."}
              </>
            ) : clientId ? (
              "Update Client"
            ) : (
              "Create Client"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
