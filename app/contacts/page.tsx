import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { PlusCircle, Search, Users } from "lucide-react"

export default function ContactsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
          <p className="text-muted-foreground">Manage all your contacts across different businesses</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search contacts..." className="w-full pl-8 md:w-[300px]" />
          </div>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Contact
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Contacts</CardTitle>
          <CardDescription>View and manage all your contacts in one place</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <Users className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No contacts yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Add contacts to keep track of clients and team members
              </p>
              <Button className="mt-4">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Your First Contact
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
