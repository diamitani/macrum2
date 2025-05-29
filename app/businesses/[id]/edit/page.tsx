"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BusinessForm } from "@/components/business-form"
import { ArrowLeft } from "lucide-react"

export default function EditBusinessPage() {
  const params = useParams()
  const businessId = params.id as string

  return (
    <div className="max-w-2xl mx-auto py-6">
      <div className="mb-6">
        <Link href={`/businesses/${businessId}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Business
          </Button>
        </Link>
      </div>

      <BusinessForm businessId={businessId} />
    </div>
  )
}
