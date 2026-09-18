import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, HardDrive } from "lucide-react"

/**
 * Files page — placeholder. File uploads are not wired yet: they need a
 * storage backend decision (Supabase / open-source object storage) before
 * the Upload buttons can do anything real. Until then this page is honest
 * about that instead of showing dead upload buttons.
 */
export default function FilesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Files</h1>
          <p className="text-muted-foreground">Manage all your files across different businesses and projects</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Files</CardTitle>
          <CardDescription>View and manage all your files in one place</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="max-w-sm text-center">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">File uploads coming soon</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Uploads need a storage backend first (Supabase or open-source object storage).
                Once that's decided, this page will store, search, and share files across your
                businesses and projects.
              </p>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <HardDrive className="h-3.5 w-3.5" />
                No files are stored in the browser — uploads stay disabled until storage is wired.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
