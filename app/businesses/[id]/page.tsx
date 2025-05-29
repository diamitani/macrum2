"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter, notFound, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProjectList } from "@/components/project-list"
import { ExpenseList } from "@/components/expense-list"
import { AssetManager } from "@/components/asset-manager"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ArrowLeft, PlusCircle, Users, Trash, Pencil, Loader2 } from "lucide-react"
import { useBusinesses } from "@/context/business-context"
import { toast } from "@/components/ui/use-toast"
import { formatDistanceToNow } from "date-fns"

export default function BusinessPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = params.id as string
  const { getBusiness, deleteBusiness, isLoading } = useBusinesses()
  const [isDeleting, setIsDeleting] = useState(false)
  const [activeTab, setActiveTab] = useState("projects")

  // Get business data
  const business = getBusiness(id)

  // Handle tab from URL parameters
  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab && ["projects", "expenses", "assets", "contacts", "settings"].includes(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading business...</p>
        </div>
      </div>
    )
  }

  // Show not found state
  if (!business) {
    return notFound()
  }

  const handleDeleteBusiness = async () => {
    setIsDeleting(true)
    try {
      const success = deleteBusiness(id)

      if (success) {
        toast({
          title: "Business deleted",
          description: "The business has been deleted successfully",
        })
        router.push("/businesses")
      } else {
        throw new Error("Failed to delete business")
      }
    } catch (error) {
      console.error("Error deleting business:", error)
      toast({
        title: "Error",
        description: "Failed to delete business. Please try again.",
        variant: "destructive",
      })
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Link href="/businesses">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">{business.name}</h1>
          {business.industry && (
            <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium">
              {business.industry}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/businesses/${id}/edit`}>
            <Button variant="outline" size="sm">
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the business and all associated data
                  including projects, tasks, expenses, and files.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={(e) => {
                    e.preventDefault()
                    handleDeleteBusiness()
                  }}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <p className="text-muted-foreground">{business.description}</p>

          {(business.website || business.email || business.phone || business.address) && (
            <div className="mt-4 space-y-2">
              {business.website && (
                <p className="text-sm">
                  <span className="font-medium">Website:</span>{" "}
                  <a
                    href={business.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {business.website}
                  </a>
                </p>
              )}
              {business.email && (
                <p className="text-sm">
                  <span className="font-medium">Email:</span>{" "}
                  <a href={`mailto:${business.email}`} className="text-primary hover:underline">
                    {business.email}
                  </a>
                </p>
              )}
              {business.phone && (
                <p className="text-sm">
                  <span className="font-medium">Phone:</span>{" "}
                  <a href={`tel:${business.phone}`} className="text-primary hover:underline">
                    {business.phone}
                  </a>
                </p>
              )}
              {business.address && (
                <p className="text-sm">
                  <span className="font-medium">Address:</span> {business.address}
                </p>
              )}
            </div>
          )}

          <p className="text-xs text-muted-foreground mt-4">
            Created {formatDistanceToNow(new Date(business.createdAt), { addSuffix: true })}
            {business.updatedAt !== business.createdAt &&
              ` • Updated ${formatDistanceToNow(new Date(business.updatedAt), { addSuffix: true })}`}
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <Card className="w-full md:w-[calc(50%-0.5rem)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{business.projectCount}</div>
            </CardContent>
          </Card>
          <Card className="w-full md:w-[calc(50%-0.5rem)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{business.activeProjects}</div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="projects" className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Projects</h2>
            <Link href={`/projects/new?businessId=${business.id}`}>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Project
              </Button>
            </Link>
          </div>
          <ProjectList businessId={business.id} />
        </TabsContent>
        <TabsContent value="expenses" className="mt-6">
          <ExpenseList businessId={business.id} />
        </TabsContent>
        <TabsContent value="assets" className="mt-6">
          <AssetManager businessId={business.id} />
        </TabsContent>
        <TabsContent value="contacts" className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Contacts</h2>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Contact
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Business Contacts</CardTitle>
              <CardDescription>Manage contacts associated with this business</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-8">
                <div className="text-center">
                  <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No contacts yet</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Add contacts to keep track of clients and team members
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Business Settings</CardTitle>
              <CardDescription>Manage business details and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Link href={`/businesses/${id}/edit`}>
                  <Button>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit Business Details
                  </Button>
                </Link>

                <div className="pt-4 border-t">
                  <h3 className="text-lg font-medium mb-2">Danger Zone</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Permanently delete this business and all of its data
                  </p>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        <Trash className="mr-2 h-4 w-4" />
                        Delete Business
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the business and all associated
                          data including projects, tasks, expenses, and files.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          onClick={(e) => {
                            e.preventDefault()
                            handleDeleteBusiness()
                          }}
                          disabled={isDeleting}
                        >
                          {isDeleting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Deleting...
                            </>
                          ) : (
                            "Delete"
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
