import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { PlusCircle, Search, FileText } from "lucide-react"

export default function FilesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Files</h1>
          <p className="text-muted-foreground">Manage all your files across different businesses and projects</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search files..." className="w-full pl-8 md:w-[300px]" />
          </div>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Upload Files
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Files</CardTitle>
          <CardDescription>View and manage all your files in one place</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No files yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">Upload files to share with your team and clients</p>
              <Button className="mt-4">
                <PlusCircle className="mr-2 h-4 w-4" />
                Upload Your First File
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
