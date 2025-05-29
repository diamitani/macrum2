"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CalendarClock, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useProjects } from "@/context/project-context"
import { useBusinesses } from "@/context/business-context"

export function RecentProjects() {
  const { projects, isLoading } = useProjects()
  const { getBusiness } = useBusinesses()

  // Get the 5 most recent projects
  const recentProjects = projects
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5)

  if (isLoading) {
    return <div>Loading projects...</div>
  }

  if (recentProjects.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 border rounded-lg">
        <div className="text-center">
          <h3 className="mt-4 text-lg font-medium">No projects yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">Create your first project to get started</p>
          <Link href="/projects/new">
            <Button className="mt-4">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Your First Project
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {recentProjects.map((project) => {
        const business = getBusiness(project.businessId)

        return (
          <Card key={project.id} className="overflow-hidden transition-all hover:shadow-md">
            <CardContent className="p-4">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="col-span-2">
                  <Link href={`/projects/${project.id}`} className="font-semibold hover:underline">
                    {project.name}
                  </Link>
                  {business && (
                    <div>
                      <Link
                        href={`/businesses/${project.businessId}`}
                        className="text-sm text-muted-foreground hover:underline"
                      >
                        {business.name}
                      </Link>
                    </div>
                  )}
                </div>
                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        project.status === "in-progress"
                          ? "default"
                          : project.status === "in-review"
                            ? "secondary"
                            : project.status === "planning"
                              ? "outline"
                              : "default"
                      }
                    >
                      {project.status.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </Badge>
                  </div>
                  <div className="mt-2">
                    <Progress value={project.progress} className="h-2" />
                    <span className="text-xs text-muted-foreground">{project.progress}% complete</span>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <CalendarClock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Due: {new Date(project.dueDate).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}

      {projects.length > 5 && (
        <div className="text-center pt-4">
          <Link href="/projects">
            <Button variant="outline">View All Projects ({projects.length})</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
