"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BusinessCard } from "@/components/business-card"
import { PlusCircle, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { useBusinesses } from "@/context/business-context"
import { Skeleton } from "@/components/ui/skeleton"

export default function BusinessesPage() {
  const { businesses, isLoading, deleteBusiness } = useBusinesses()
  const [searchQuery, setSearchQuery] = useState("")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [businessToDelete, setBusinessToDelete] = useState<string | null>(null)

  // Filter businesses based on search query
  const filteredBusinesses = businesses.filter(
    (business) =>
      business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (business.industry && business.industry.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const handleDeleteBusiness = () => {
    if (businessToDelete) {
      const success = deleteBusiness(businessToDelete)

      if (success) {
        toast({
          title: "Business deleted",
          description: "The business has been deleted successfully",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to delete business. Please try again.",
          variant: "destructive",
        })
      }

      setIsDeleteDialogOpen(false)
      setBusinessToDelete(null)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="mt-2 h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Businesses</h1>
          <p className="text-muted-foreground">Manage your different business entities</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search businesses..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Link href="/businesses/new">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Business
            </Button>
          </Link>
        </div>
      </div>

      {filteredBusinesses.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredBusinesses.map((business) => (
            <BusinessCard
              key={business.id}
              id={business.id}
              name={business.name}
              description={business.description}
              projectCount={business.projectCount}
              activeProjects={business.activeProjects}
              industry={business.industry}
              onDelete={(id) => {
                setBusinessToDelete(id)
                setIsDeleteDialogOpen(true)
              }}
            />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center p-8 border rounded-lg">
          <div className="text-center">
            <h3 className="mt-4 text-lg font-medium">
              {searchQuery ? "No businesses match your search" : "No businesses yet"}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {searchQuery
                ? "Try adjusting your search terms or clear the search"
                : "Add your first business to start managing your projects"}
            </p>
            {!searchQuery && (
              <Link href="/businesses/new">
                <Button className="mt-4">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Your First Business
                </Button>
              </Link>
            )}
            {searchQuery && (
              <Button className="mt-4" variant="outline" onClick={() => setSearchQuery("")}>
                Clear Search
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this business? This action cannot be undone and will delete all associated
              projects, tasks, expenses, and files.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteBusiness}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
