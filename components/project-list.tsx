"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { CalendarClock, PlusCircle } from "lucide-react"
import { ProjectActions } from "@/components/project-actions"
import { useProjects } from "@/context/project-context"
import { useBusinesses } from "@/context/business-context"
import { Skeleton } from "@/components/ui/skeleton"

interface ProjectListProps {
  businessId?: string
  clientId?: string
}

export function ProjectList({ businessId, clientId }: ProjectListProps) {
  const { projects, isLoading, deleteProject } = useProjects()
  const { getBusiness } = useBusinesses()

  // Filter projects based on businessId if provided
  const filteredProjects = businessId ? projects.filter((project) => project.businessId === businessId) : projects

  const handleDeleteProject = async (projectId: string) => {
    const success = deleteProject(projectId)
    if (!success) {
      console.error("Failed to delete project")
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (filteredProjects.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 border rounded-lg">
        <div className="text-center">
          <h3 className="mt-4 text-lg font-medium">No projects found</h3>
          <p className="mt-2 text-sm text-muted-foreground">Create a new project to get started</p>
          <Button asChild className="mt-4">
            <Link href={businessId ? `/projects/new?businessId=${businessId}` : "/projects/new"}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Your First Project
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {filteredProjects.map((project) => {
        const business = getBusiness(project.businessId)

        return (
          <Card key={project.id} className="overflow-hidden transition-all hover:shadow-md">
            <CardContent className="p-4">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="col-span-2">
                  <Link href={`/projects/${project.id}`} className="font-semibold hover:underline">
                    {project.name}
                  </Link>
                  {!businessId && business && (
                    <div>
                      <Link
                        href={`/businesses/${project.businessId}`}
                        className="text-sm text-muted-foreground hover:underline"
                      >
                        {business.name}
                      </Link>
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{project.description}</p>
                </div>
                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      variant={
                        project.status === "in-progress"
                          ? "default"
                          : project.status === "in-review"
                            ? "secondary"
                            : project.status === "planning"
                              ? "outline"
                              : project.status === "completed"
                                ? "success"
                                : "default"
                      }
                    >
                      {project.status.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </Badge>
                    <Badge
                      variant={
                        project.priority === "high"
                          ? "destructive"
                          : project.priority === "medium"
                            ? "default"
                            : "secondary"
                      }
                    >
                      {project.priority}
                    </Badge>
                  </div>
                  <div>
                    <Progress value={project.progress} className="h-2" />
                    <span className="text-xs text-muted-foreground">{project.progress}% complete</span>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center">
                    <CalendarClock className="h-4 w-4 text-muted-foreground mr-2" />
                    <span className="text-sm">Due: {new Date(project.dueDate).toLocaleDateString()}</span>
                  </div>
                  <ProjectActions project={project} onDelete={() => handleDeleteProject(project.id)} />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
