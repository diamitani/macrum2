import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"

export function CalendarFilters() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Mini Calendar</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Calendar mode="single" selected={new Date()} className="rounded-md border" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Event Types</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="meetings" defaultChecked />
              <Label htmlFor="meetings">Meetings</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="tasks" defaultChecked />
              <Label htmlFor="tasks">Tasks</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="deadlines" defaultChecked />
              <Label htmlFor="deadlines">Deadlines</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="reminders" defaultChecked />
              <Label htmlFor="reminders">Reminders</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Priority</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="high" defaultChecked />
              <Label htmlFor="high">High</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="medium" defaultChecked />
              <Label htmlFor="medium">Medium</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="low" defaultChecked />
              <Label htmlFor="low">Low</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Projects</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="all-projects" defaultChecked />
              <Label htmlFor="all-projects">All Projects</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="project-1" />
              <Label htmlFor="project-1">Website Redesign</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="project-2" />
              <Label htmlFor="project-2">Marketing Campaign</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="project-3" />
              <Label htmlFor="project-3">Product Launch</Label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
