"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { BusinessCard } from "@/components/business-card"
import { RecentProjects } from "@/components/recent-projects"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { useBusinesses } from "@/context/business-context"
import { toast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

export default function Home() {
  const { businesses, isLoading, deleteBusiness } = useBusinesses()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [businessToDelete, setBusinessToDelete] = useState<string | null>(null)

  const handleDeleteBusiness = (id: string) => {
    const success = deleteBusiness(id)

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
  }

  return (
    <div className="space-y-6">
      <DashboardHeader />

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Your Businesses</h2>
        <Link href="/businesses/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Business
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      ) : businesses.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {businesses.slice(0, 3).map((business) => (
            <BusinessCard
              key={business.id}
              id={business.id}
              name={business.name}
              description={business.description}
              projectCount={business.projectCount}
              activeProjects={business.activeProjects}
              industry={business.industry}
              onDelete={handleDeleteBusiness}
            />
          ))}
          {businesses.length > 3 && (
            <Link
              href="/businesses"
              className="flex items-center justify-center p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="text-center">
                <p className="font-medium">View All Businesses</p>
                <p className="text-sm text-muted-foreground">
                  {businesses.length - 3} more {businesses.length - 3 === 1 ? "business" : "businesses"}
                </p>
              </div>
            </Link>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center p-8 border rounded-lg">
          <div className="text-center">
            <h3 className="mt-4 text-lg font-medium">No businesses yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Add your first business to start managing your projects
            </p>
            <Link href="/businesses/new">
              <Button className="mt-4">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Your First Business
              </Button>
            </Link>
          </div>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-2xl font-bold tracking-tight mb-4">Recent Projects</h2>
        <RecentProjects />
      </div>
    </div>
  )
}
