"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useClients } from "@/context/client-context"
import { useBusinesses } from "@/context/business-context"
import { Loader2, User, Mail, Phone, Building2, MapPin, FileText } from "lucide-react"

const clientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  address: z.string().optional(),
  status: z.enum(["active", "prospect", "inactive"]),
  businessIds: z.array(z.string()).min(1, "At least one business must be selected"),
  notes: z.string().optional(),
})

type ClientFormData = z.infer<typeof clientSchema>

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

interface ClientFormProps {
  client?: Client
  onSuccess?: () => void
}

export function ClientForm({ client, onSuccess }: ClientFormProps) {
  const { createClient, updateClient } = useClients()
  const { businesses } = useBusinesses()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: client?.name || "",
      email: client?.email || "",
      phone: client?.phone || "",
      company: client?.company || "",
      address: client?.address || "",
      status: client?.status || "prospect",
      businessIds: client?.businessIds || [],
      notes: client?.notes || "",
    },
  })

  const selectedBusinessIds = watch("businessIds")

  useEffect(() => {
    if (client) {
      reset({
        name: client.name,
        email: client.email,
        phone: client.phone || "",
        company: client.company || "",
        address: client.address || "",
        status: client.status,
        businessIds: client.businessIds,
        notes: client.notes || "",
      })
    }
  }, [client, reset])

  const onSubmit = async (data: ClientFormData) => {
    setIsSubmitting(true)
    try {
      if (client) {
        await updateClient(client.id, data)
      } else {
        await createClient(data)
      }
      onSuccess?.()
    } catch (error) {
      console.error("Failed to save client:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBusinessToggle = (businessId: string, checked: boolean) => {
    const currentIds = selectedBusinessIds || []
    if (checked) {
      setValue("businessIds", [...currentIds, businessId])
    } else {
      setValue(
        "businessIds",
        currentIds.filter((id) => id !== businessId),
      )
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="required">
                Full Name
              </Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Enter client's full name"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="required">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="client@example.com"
                  className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                />
              </div>
              {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input id="phone" {...register("phone")} placeholder="+1 (555) 123-4567" className="pl-10" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="required">
                Status
              </Label>
              <Select
                value={watch("status")}
                onValueChange={(value) => setValue("status", value as "active" | "prospect" | "inactive")}
              >
                <SelectTrigger className={errors.status ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="prospect">Prospect</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && <p className="text-sm text-red-600">{errors.status.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input id="company" {...register("company")} placeholder="Company name" className="pl-10" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
              <Textarea
                id="address"
                {...register("address")}
                placeholder="Full address"
                className="pl-10 min-h-[80px]"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Associations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Business Associations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label className="required">Select Businesses</Label>
            {businesses.length === 0 ? (
              <p className="text-sm text-gray-600">No businesses available. Create a business first.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {businesses.map((business) => (
                  <div key={business.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`business-${business.id}`}
                      checked={selectedBusinessIds?.includes(business.id) || false}
                      onCheckedChange={(checked) => handleBusinessToggle(business.id, checked as boolean)}
                    />
                    <Label htmlFor={`business-${business.id}`} className="text-sm font-normal cursor-pointer">
                      {business.name}
                    </Label>
                  </div>
                ))}
              </div>
            )}
            {errors.businessIds && <p className="text-sm text-red-600">{errors.businessIds.message}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              {...register("notes")}
              placeholder="Any additional information about the client..."
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end space-x-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {client ? "Update Client" : "Create Client"}
        </Button>
      </div>
    </form>
  )
}
