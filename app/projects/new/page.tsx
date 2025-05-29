"use client"

import { Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ProjectForm } from "@/components/project-form"
import { ArrowLeft } from "lucide-react"

function ProjectFormWrapper() {
  const searchParams = useSearchParams()
  const businessId = searchParams.get("businessId")

  return <ProjectForm businessId={businessId || undefined} />
}

export default function NewProjectPage() {
  return (
    <div className="max-w-2xl mx-auto py-6">
      <div className="mb-6">
        <Link href="/projects">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>
        </Link>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <ProjectFormWrapper />
      </Suspense>
    </div>
  )
}
