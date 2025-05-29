import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, FolderKanban, Plus, Search } from "lucide-react"

export default function ProjectNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <FolderKanban className="h-16 w-16 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl">Project Not Found</CardTitle>
          <CardDescription>
            The project you're looking for doesn't exist, may have been deleted, or you don't have permission to view
            it.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Button asChild className="w-full">
              <Link href="/projects">
                <Search className="mr-2 h-4 w-4" />
                Browse All Projects
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/projects/new">
                <Plus className="mr-2 h-4 w-4" />
                Create New Project
              </Link>
            </Button>
            <Button variant="ghost" asChild className="w-full">
              <Link href="/businesses">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Businesses
              </Link>
            </Button>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              If you believe this is an error, try refreshing the page or contact support.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
