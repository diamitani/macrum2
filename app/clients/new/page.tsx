
"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ClientForm } from "@/components/client-form"
import { ArrowLeft } from "lucide-react"

export default function NewClientPage() {
  return (
    <div className="max-w-2xl mx-auto py-6">
      <div className="mb-6">
        <Link href="/clients">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Clients
          </Button>
        </Link>
      </div>

      <ClientForm />
    </div>
  )
}
