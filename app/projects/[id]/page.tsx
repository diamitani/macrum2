"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { notFound, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TaskList } from "@/components/task-list"
import { ExpenseList } from "@/components/expense-list"
import { AssetManager } from "@/components/asset-manager"
import { DeleteProjectButton } from "@/components/delete-project-button"
import { ArrowLeft, CalendarClock, Users, MessageSquare, Pencil } from "lucide-react"
import { useProjects } from "@/context/project-context"
import { useBusinesses } from "@/context/business-context"
import { formatDistanceToNow } from "date-fns"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProjectPage() {
  const params = useParams()
  const id = params.id as string
  const { getProject, isLoading: projectsLoading } = useProjects()
  const { getBusiness } = useBusinesses()
  const [isLoading, setIsLoading] = useState(true)
  const [project, setProject] = useState<any>(null)

  // Effect to handle project loading with retry logic
  useEffect(() => {
    const loadProject = () => {
      const foundProject = getProject(id)
      if (foundProject) {
        setProject(foundProject)
        setIsLoading(false)
      } else if (!projectsLoading) {
        // If projects are loaded but project not found, show not found
        setIsLoading(false)
      }
      // If projects are still loading, keep waiting
    }

    loadProject()

    // Retry loading after a short delay in case the project was just created
    const retryTimeout = setTimeout(loadProject, 500)

    return () => clearTimeout(retryTimeout)
  }, [id, getProject, projectsLoading])

  // Show loading state
  if (isLoading || projectsLoading) {
    return <ProjectDetailSkeleton />
  }

  // Show not found state
  if (!project) {
    return notFound()
  }

  // Get business data if available
  const business = project.businessId ? getBusiness(project.businessId) : null

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Link href={business ? `/businesses/${project.businessId}` : "/projects"}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to {business ? business.name : "Projects"}
            </Button>
          </Link>
        </div>
        <div className="flex items-center gap-2">
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
            {project.status.replace("-", " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}
          </Badge>
          <Badge
            variant={
              project.priority === "high" ? "destructive" : project.priority === "medium" ? "default" : "secondary"
            }
          >
            {project.priority}
          </Badge>
          <Button variant="outline" size="sm">
            <Pencil className="mr-2 h-4 w-4" />
            Edit Project
          </Button>
          <DeleteProjectButton projectId={project.id} businessId={project.businessId} />
        </div>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
        <p className="mt-2 text-muted-foreground">{project.description}</p>
        <p className="text-xs text-muted-foreground mt-2">
          Created {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}
          {project.updatedAt !== project.createdAt &&
            ` • Updated ${formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}`}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project.progress}%</div>
            <Progress value={project.progress} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {project.completedTasks} of {project.taskCount} tasks completed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm">
                {new Date(project.startDate).toLocaleDateString()} - {new Date(project.dueDate).toLocaleDateString()}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Due {formatDistanceToNow(new Date(project.dueDate), { addSuffix: true })}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Business</CardTitle>
          </CardHeader>
          <CardContent>
            {business ? (
              <Link href={`/businesses/${project.businessId}`} className="text-sm hover:underline">
                {business.name}
              </Link>
            ) : (
              <span className="text-sm text-muted-foreground">Business not found</span>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project.taskCount}</div>
            <p className="text-xs text-muted-foreground">{project.completedTasks} completed</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tasks" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>
        <TabsContent value="tasks" className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Tasks</h2>
            <Button>Add Task</Button>
          </div>
          <TaskList projectId={project.id} />
        </TabsContent>
        <TabsContent value="expenses" className="mt-6">
          <ExpenseList projectId={project.id} />
        </TabsContent>
        <TabsContent value="files" className="mt-6">
          <AssetManager projectId={project.id} />
        </TabsContent>
        <TabsContent value="contacts" className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Contacts</h2>
            <Button>Add Contact</Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Project Contacts</CardTitle>
              <CardDescription>Manage contacts associated with this project</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-8">
                <div className="text-center">
                  <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No contacts yet</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Add contacts to keep track of clients and team members
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notes" className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Notes</h2>
            <Button>Add Note</Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Project Notes</CardTitle>
              <CardDescription>Keep track of important information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-8">
                <div className="text-center">
                  <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No notes yet</h3>
                  <p className="mt-2 text-sm text-muted-foreground">Add notes to document important information</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ProjectDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      <div>
        <Skeleton className="h-8 w-64" />
        <Skeleton className="mt-2 h-4 w-full max-w-xl" />
        <Skeleton className="mt-2 h-3 w-48" />
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-2 w-full mt-2" />
              <Skeleton className="h-3 w-32 mt-1" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        <Skeleton className="h-10 w-full max-w-md" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  )
}
