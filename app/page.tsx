"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DashboardHeader } from "@/components/dashboard-header"
import { Building2, FolderKanban, CheckSquare, Plus, TrendingUp, Calendar, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useBusinesses } from "@/context/business-context"
import { useProjects } from "@/context/project-context"
import { formatDistanceToNow } from "date-fns"

export default function DashboardPage() {
  const { businesses, isLoading: businessesLoading } = useBusinesses()
  const { projects, isLoading: projectsLoading } = useProjects()
  const [mounted, setMounted] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    const authStatus = localStorage.getItem("macrum_auth")
    if (authStatus === "true") {
      setIsAuthenticated(true)
    } else {
      router.push("/marketing")
    }
  }, [router])

  if (!mounted || !isAuthenticated || businessesLoading || projectsLoading) {
    return <DashboardSkeleton />
  }

  // Calculate statistics
  const totalBusinesses = businesses.length
  const totalProjects = projects.length
  const activeProjects = projects.filter((p) => p.status === "in-progress").length
  const completedProjects = projects.filter((p) => p.status === "completed").length
  const overallProgress = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0

  // Get recent projects (last 5)
  const recentProjects = projects
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5)

  // Get overdue projects
  const overdueProjects = projects.filter((p) => p.status !== "completed" && new Date(p.dueDate) < new Date())

  return (
    <div className="space-y-6">
      <DashboardHeader />

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Businesses</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBusinesses}</div>
            <p className="text-xs text-muted-foreground">
              {businesses.filter((b) => b.status === "active").length} active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProjects}</div>
            <p className="text-xs text-muted-foreground">{activeProjects} in progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallProgress}%</div>
            <Progress value={overallProgress} className="h-2 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Projects</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{overdueProjects.length}</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Get started with common tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button asChild className="h-auto p-4 flex-col gap-2">
              <Link href="/businesses/new">
                <Building2 className="h-6 w-6" />
                <span>New Business</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2">
              <Link href="/projects/new">
                <FolderKanban className="h-6 w-6" />
                <span>New Project</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2">
              <Link href="/tasks">
                <CheckSquare className="h-6 w-6" />
                <span>View Tasks</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2">
              <Link href="/calendar">
                <Calendar className="h-6 w-6" />
                <span>Calendar</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>Your latest project activity</CardDescription>
          </CardHeader>
          <CardContent>
            {recentProjects.length > 0 ? (
              <div className="space-y-4">
                {recentProjects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Link href={`/projects/${project.id}`} className="font-medium hover:underline">
                        {project.name}
                      </Link>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            project.status === "completed"
                              ? "default"
                              : project.status === "in-progress"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {project.status.replace("-", " ")}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Updated {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{project.progress}%</div>
                      <Progress value={project.progress} className="h-1 w-16" />
                    </div>
                  </div>
                ))}
                <Button asChild variant="outline" className="w-full">
                  <Link href="/projects">View All Projects</Link>
                </Button>
              </div>
            ) : (
              <div className="text-center py-6">
                <FolderKanban className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No projects yet</h3>
                <p className="mt-2 text-sm text-muted-foreground">Create your first project to get started</p>
                <Button asChild className="mt-4">
                  <Link href="/projects/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Project
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Business Overview</CardTitle>
            <CardDescription>Your business portfolio</CardDescription>
          </CardHeader>
          <CardContent>
            {businesses.length > 0 ? (
              <div className="space-y-4">
                {businesses.slice(0, 5).map((business) => (
                  <div key={business.id} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Link href={`/businesses/${business.id}`} className="font-medium hover:underline">
                        {business.name}
                      </Link>
                      <div className="flex items-center gap-2">
                        <Badge variant={business.status === "active" ? "default" : "secondary"}>
                          {business.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{business.industry}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{business.projectCount} projects</div>
                      <div className="text-xs text-muted-foreground">{business.activeProjects} active</div>
                    </div>
                  </div>
                ))}
                <Button asChild variant="outline" className="w-full">
                  <Link href="/businesses">View All Businesses</Link>
                </Button>
              </div>
            ) : (
              <div className="text-center py-6">
                <Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No businesses yet</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Create your first business to organize your projects
                </p>
                <Button asChild className="mt-4">
                  <Link href="/businesses/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Business
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Overdue Projects Alert */}
      {overdueProjects.length > 0 && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Overdue Projects
            </CardTitle>
            <CardDescription>
              {overdueProjects.length} project{overdueProjects.length > 1 ? "s" : ""} past due date
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {overdueProjects.slice(0, 3).map((project) => (
                <div key={project.id} className="flex items-center justify-between">
                  <Link href={`/projects/${project.id}`} className="font-medium hover:underline">
                    {project.name}
                  </Link>
                  <span className="text-sm text-destructive">
                    Due {formatDistanceToNow(new Date(project.dueDate), { addSuffix: true })}
                  </span>
                </div>
              ))}
              {overdueProjects.length > 3 && (
                <p className="text-sm text-muted-foreground">And {overdueProjects.length - 3} more...</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="h-8 w-48 bg-muted rounded animate-pulse" />
          <div className="h-4 w-64 bg-muted rounded animate-pulse mt-2" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <div className="h-4 w-24 bg-muted rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-muted rounded animate-pulse" />
              <div className="h-3 w-20 bg-muted rounded animate-pulse mt-1" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="h-6 w-32 bg-muted rounded animate-pulse" />
          <div className="h-4 w-48 bg-muted rounded animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="h-32 w-full bg-muted rounded animate-pulse" />
        </CardContent>
      </Card>
    </div>
  )
}
