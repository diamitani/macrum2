"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BusinessForm } from "@/components/business-form"
import { ArrowLeft } from "lucide-react"

export default function NewBusinessPage() {
  return (
    <div className="max-w-2xl mx-auto py-6">
      <div className="mb-6">
        <Link href="/businesses">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Businesses
          </Button>
        </Link>
      </div>

      <BusinessForm />
    </div>
  )
}
