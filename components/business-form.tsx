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
import { useBusinesses } from "@/context/business-context"
import { validateBusiness, type ValidationError } from "@/lib/validations"

interface BusinessFormProps {
  businessId?: string
  onCancel?: () => void
}

const INDUSTRIES = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Retail",
  "Manufacturing",
  "Consulting",
  "Marketing",
  "Real Estate",
  "Other",
]

export function BusinessForm({ businessId, onCancel }: BusinessFormProps) {
  const router = useRouter()
  const { getBusiness, addBusiness, updateBusiness } = useBusinesses()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<ValidationError[]>([])

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    industry: "",
    website: "",
    email: "",
    phone: "",
    address: "",
  })

  // If editing, load the business data
  useEffect(() => {
    if (businessId) {
      const business = getBusiness(businessId)
      if (business) {
        setFormData({
          name: business.name,
          description: business.description,
          industry: business.industry || "",
          website: business.website || "",
          email: business.email || "",
          phone: business.phone || "",
          address: business.address || "",
        })
      }
    }
  }, [businessId, getBusiness])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error for this field
    setErrors(errors.filter((error) => error.field !== name))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error for this field
    setErrors(errors.filter((error) => error.field !== name))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validate form data
    const validationErrors = validateBusiness(formData)
    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      setIsSubmitting(false)
      return
    }

    try {
      if (businessId) {
        // Update existing business
        updateBusiness(businessId, formData)
        toast({
          title: "Business updated",
          description: `${formData.name} has been updated successfully.`,
        })
        router.push(`/businesses/${businessId}`)
      } else {
        // Create new business
        const newBusiness = addBusiness(formData)
        toast({
          title: "Business created",
          description: `${formData.name} has been created successfully.`,
        })
        router.push(`/businesses/${newBusiness.id}`)
      }
    } catch (error) {
      console.error("Error saving business:", error)
      toast({
        title: "Error",
        description: "Failed to save business. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getErrorMessage = (field: string) => {
    const error = errors.find((err) => err.field === field)
    return error ? error.message : null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{businessId ? "Edit Business" : "Create New Business"}</CardTitle>
        <CardDescription>
          {businessId ? "Update your business details" : "Add a new business to your ModularCRM"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="required">
              Business Name
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter business name"
              value={formData.name}
              onChange={handleChange}
              className={getErrorMessage("name") ? "border-destructive" : ""}
            />
            {getErrorMessage("name") && <p className="text-sm text-destructive">{getErrorMessage("name")}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Select value={formData.industry} onValueChange={(value) => handleSelectChange("industry", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                {INDUSTRIES.map((industry) => (
                  <SelectItem key={industry} value={industry.toLowerCase()}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Enter business description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={getErrorMessage("description") ? "border-destructive" : ""}
            />
            {getErrorMessage("description") && (
              <p className="text-sm text-destructive">{getErrorMessage("description")}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                placeholder="https://example.com"
                value={formData.website}
                onChange={handleChange}
                className={getErrorMessage("website") ? "border-destructive" : ""}
              />
              {getErrorMessage("website") && <p className="text-sm text-destructive">{getErrorMessage("website")}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="contact@example.com"
                value={formData.email}
                onChange={handleChange}
                className={getErrorMessage("email") ? "border-destructive" : ""}
              />
              {getErrorMessage("email") && <p className="text-sm text-destructive">{getErrorMessage("email")}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="(123) 456-7890"
                value={formData.phone}
                onChange={handleChange}
                className={getErrorMessage("phone") ? "border-destructive" : ""}
              />
              {getErrorMessage("phone") && <p className="text-sm text-destructive">{getErrorMessage("phone")}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                placeholder="123 Business St, City, State"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            type="button"
            onClick={onCancel || (() => router.push("/businesses"))}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {businessId ? "Updating..." : "Creating..."}
              </>
            ) : businessId ? (
              "Update Business"
            ) : (
              "Create Business"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
