import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Building2 } from "lucide-react"

export default function BusinessNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
      <Building2 className="h-16 w-16 text-muted-foreground mb-4" />
      <h1 className="text-3xl font-bold">Business Not Found</h1>
      <p className="text-muted-foreground mt-2 mb-6 max-w-md">
        The business you're looking for doesn't exist or has been deleted.
      </p>
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/businesses">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Businesses
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/businesses/new">Create New Business</Link>
        </Button>
      </div>
    </div>
  )
}
