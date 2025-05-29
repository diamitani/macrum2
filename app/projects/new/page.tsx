"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { ArrowLeft, CalendarIcon, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useBusinesses } from "@/context/business-context"
import { useProjects } from "@/context/project-context"
import { validateProject, type ProjectValidationError } from "@/lib/project-validations"

export default function NewProjectPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const businessId = searchParams.get("businessId")
  const [isLoading, setIsLoading] = useState(false)
  const [startDate, setStartDate] = useState<Date | undefined>(new Date())
  const [dueDate, setDueDate] = useState<Date | undefined>(new Date(new Date().setMonth(new Date().getMonth() + 1)))
  const [errors, setErrors] = useState<ProjectValidationError[]>([])

  const { businesses, getBusiness } = useBusinesses()
  const { addProject } = useProjects()

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    businessId: businessId || "",
    status: "planning" as const,
    priority: "medium" as const,
  })

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

  const handleDateChange = (field: "startDate" | "dueDate", date: Date | undefined) => {
    if (field === "startDate") {
      setStartDate(date)
    } else {
      setDueDate(date)
    }

    // Clear error for this field
    setErrors(errors.filter((error) => error.field !== field))
  }

  const getErrorMessage = (field: string) => {
    const error = errors.find((err) => err.field === field)
    return error ? error.message : null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Prepare data for validation
      const projectData = {
        ...formData,
        startDate: startDate?.toISOString(),
        dueDate: dueDate?.toISOString(),
      }

      // Validate form data
      const validationErrors = validateProject(projectData)
      if (validationErrors.length > 0) {
        setErrors(validationErrors)
        setIsLoading(false)
        return
      }

      // Check if business exists
      const business = getBusiness(formData.businessId)
      if (!business) {
        toast({
          title: "Error",
          description: "Selected business not found. Please select a valid business.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // Create the project
      const newProject = addProject({
        name: formData.name.trim(),
        description: formData.description.trim(),
        businessId: formData.businessId,
        status: formData.status,
        priority: formData.priority,
        progress: 0,
        startDate: startDate!.toISOString(),
        dueDate: dueDate!.toISOString(),
      })

      toast({
        title: "Project created",
        description: `${newProject.name} has been created successfully.`,
      })

      // Wait a bit to ensure state is updated before navigation
      await new Promise((resolve) => setTimeout(resolve, 100))

      // Navigate to the appropriate page
      if (businessId) {
        router.push(`/businesses/${businessId}?tab=projects`)
      } else {
        router.push(`/projects`)
      }
    } catch (error) {
      console.error("Error creating project:", error)
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Get the selected business for display
  const selectedBusiness = formData.businessId ? getBusiness(formData.businessId) : null

  return (
    <div className="max-w-2xl mx-auto py-6">
      <div className="mb-6">
        <Link href={businessId ? `/businesses/${businessId}` : "/projects"}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {businessId ? "Back to Business" : "Back to Projects"}
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Project</CardTitle>
          <CardDescription>
            Add a new project to your ModularCRM
            {selectedBusiness && (
              <span className="block mt-1 text-sm">
                for <span className="font-medium">{selectedBusiness.name}</span>
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="required">
                Project Name
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter project name"
                value={formData.name}
                onChange={handleChange}
                className={getErrorMessage("name") ? "border-destructive" : ""}
              />
              {getErrorMessage("name") && <p className="text-sm text-destructive">{getErrorMessage("name")}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="required">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter project description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={getErrorMessage("description") ? "border-destructive" : ""}
              />
              {getErrorMessage("description") && (
                <p className="text-sm text-destructive">{getErrorMessage("description")}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="business" className="required">
                Business
              </Label>
              <Select value={formData.businessId} onValueChange={(value) => handleSelectChange("businessId", value)}>
                <SelectTrigger className={getErrorMessage("businessId") ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select a business" />
                </SelectTrigger>
                <SelectContent>
                  {businesses.length > 0 ? (
                    businesses.map((business) => (
                      <SelectItem key={business.id} value={business.id}>
                        {business.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      No businesses available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {getErrorMessage("businessId") && (
                <p className="text-sm text-destructive">{getErrorMessage("businessId")}</p>
              )}
              {businesses.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  <Link href="/businesses/new" className="text-primary hover:underline">
                    Create a business first
                  </Link>{" "}
                  to add projects to it.
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status" className="required">
                  Status
                </Label>
                <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                  <SelectTrigger className={getErrorMessage("status") ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="in-review">In Review</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                {getErrorMessage("status") && <p className="text-sm text-destructive">{getErrorMessage("status")}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority" className="required">
                  Priority
                </Label>
                <Select value={formData.priority} onValueChange={(value) => handleSelectChange("priority", value)}>
                  <SelectTrigger className={getErrorMessage("priority") ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
                {getErrorMessage("priority") && (
                  <p className="text-sm text-destructive">{getErrorMessage("priority")}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="required">Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${getErrorMessage("startDate") ? "border-destructive" : ""}`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => handleDateChange("startDate", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {getErrorMessage("startDate") && (
                  <p className="text-sm text-destructive">{getErrorMessage("startDate")}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="required">Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${getErrorMessage("dueDate") ? "border-destructive" : ""}`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dueDate ? format(dueDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dueDate}
                      onSelect={(date) => handleDateChange("dueDate", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {getErrorMessage("dueDate") && <p className="text-sm text-destructive">{getErrorMessage("dueDate")}</p>}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              type="button"
              onClick={() => router.push(businessId ? `/businesses/${businessId}` : "/projects")}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || businesses.length === 0}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Project"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
