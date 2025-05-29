"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useBusinesses } from "@/context/business-context"
import { validateBusiness } from "@/lib/validations"
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

interface BusinessFormProps {
  business?: {
    id: string
    name: string
    description: string
    industry?: string
    website?: string
    email?: string
    phone?: string
    address?: string
  }
  mode?: "create" | "edit"
}

export function BusinessForm({ business, mode = "create" }: BusinessFormProps) {
  const router = useRouter()
  const { addBusiness, updateBusiness } = useBusinesses()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState({
    name: business?.name || "",
    description: business?.description || "",
    industry: business?.industry || "",
    website: business?.website || "",
    email: business?.email || "",
    phone: business?.phone || "",
    address: business?.address || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    try {
      const validation = validateBusiness(formData)
      if (!validation.success) {
        const fieldErrors: Record<string, string> = {}
        validation.error.errors.forEach((error) => {
          if (error.path[0]) {
            fieldErrors[error.path[0] as string] = error.message
          }
        })
        setErrors(fieldErrors)
        return
      }

      if (mode === "edit" && business) {
        updateBusiness(business.id, formData)
        toast({
          title: "Success",
          description: "Business updated successfully",
        })
        router.push(`/businesses/${business.id}`)
      } else {
        const newBusiness = addBusiness(formData)
        toast({
          title: "Success",
          description: "Business created successfully",
        })
        router.push(`/businesses/${newBusiness.id}`)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{mode === "edit" ? "Edit Business" : "Create New Business"}</CardTitle>
        <CardDescription>
          {mode === "edit" ? "Update your business information" : "Add a new business to your portfolio"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="required">
                Business Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Enter business name"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                value={formData.industry}
                onChange={(e) => handleChange("industry", e.target.value)}
                placeholder="e.g., Technology, Healthcare"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="required">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Describe your business"
              rows={3}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="business@example.com"
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={formData.website}
              onChange={(e) => handleChange("website", e.target.value)}
              placeholder="https://example.com"
              className={errors.website ? "border-red-500" : ""}
            />
            {errors.website && <p className="text-sm text-red-500">{errors.website}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="Business address"
              rows={2}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === "edit" ? "Update Business" : "Create Business"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
