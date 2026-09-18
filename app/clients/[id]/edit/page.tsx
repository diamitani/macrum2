"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ClientForm } from "@/components/client-form"
import { ArrowLeft } from "lucide-react"

export default function EditClientPage() {
  const params = useParams()
  const clientId = params.id as string

  return (
    <div className="max-w-2xl mx-auto py-6">
      <div className="mb-6">
        <Link href={`/clients/${clientId}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Client
          </Button>
        </Link>
      </div>

      <ClientForm clientId={clientId} />
    </div>
  )
}
