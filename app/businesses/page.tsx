"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BusinessCard } from "@/components/business-card"
import { useBusinesses } from "@/context/business-context"
import { Plus, Building2 } from "lucide-react"

export default function BusinessesPage() {
  const { businesses, isLoading } = useBusinesses()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Businesses</h1>
          <Button asChild>
            <Link href="/businesses/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Business
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Businesses</h1>
        <Button asChild>
          <Link href="/businesses/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Business
          </Link>
        </Button>
      </div>

      {businesses.length === 0 ? (
        <div className="text-center py-12">
          <Building2 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No businesses</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new business.</p>
          <div className="mt-6">
            <Button asChild>
              <Link href="/businesses/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Business
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.map((business) => (
            <BusinessCard key={business.id} business={business} />
          ))}
        </div>
      )}
    </div>
  )
}
