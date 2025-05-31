"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GitBranch, AlertTriangle, CheckCircle, Clock, ArrowRight } from "lucide-react"

export default function DependenciesPage() {
  const [dependencies, setDependencies] = useState([])
  const [criticalPath, setCriticalPath] = useState([])
  const [blockedTasks, setBlockedTasks] = useState([])

  useEffect(() => {
    // Mock data for dependencies
    const mockDependencies = [
      {
        id: "dep-1",
        taskId: "task-1",
        taskTitle: "Design System Setup",
        dependsOnId: "task-2",
        dependsOnTitle: "Requirements Analysis",
        projectId: "proj-1",
        projectName: "Website Redesign",
        businessId: "bus-1",
        businessName: "Tech Solutions Inc",
        status: "completed",
        createdAt: new Date().toISOString(),
      },
      {
        id: "dep-2",
        taskId: "task-3",
        taskTitle: "Frontend Development",
        dependsOnId: "task-1",
        dependsOnTitle: "Design System Setup",
        projectId: "proj-1",
        projectName: "Website Redesign",
        businessId: "bus-1",
        businessName: "Tech Solutions Inc",
        status: "blocked",
        createdAt: new Date().toISOString(),
      },
    ]

    setDependencies(mockDependencies)
    setBlockedTasks(mockDependencies.filter((dep) => dep.status === "blocked"))
    setCriticalPath(mockDependencies.slice(0, 3))
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Task Dependencies</h1>
          <p className="text-muted-foreground">Manage and visualize task relationships across your projects</p>
        </div>
        <Button>
          <GitBranch className="mr-2 h-4 w-4" />
          View Dependency Graph
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Dependencies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dependencies.length}</div>
            <p className="text-xs text-muted-foreground">Across all projects</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Blocked Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{blockedTasks.length}</div>
            <p className="text-xs text-muted-foreground">Waiting on dependencies</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Critical Path</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{criticalPath.length}</div>
            <p className="text-xs text-muted-foreground">Tasks on critical path</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Dependencies</TabsTrigger>
          <TabsTrigger value="blocked">Blocked Tasks</TabsTrigger>
          <TabsTrigger value="critical">Critical Path</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>All Task Dependencies</CardTitle>
              <CardDescription>Complete overview of task relationships across your projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dependencies.map((dep) => (
                  <div key={dep.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{dep.businessName}</Badge>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        <Badge variant="secondary">{dep.projectName}</Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{dep.taskTitle}</span>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{dep.dependsOnTitle}</span>
                      </div>
                    </div>
                    <Badge
                      variant={
                        dep.status === "completed" ? "default" : dep.status === "blocked" ? "destructive" : "secondary"
                      }
                    >
                      {dep.status === "completed" && <CheckCircle className="mr-1 h-3 w-3" />}
                      {dep.status === "blocked" && <AlertTriangle className="mr-1 h-3 w-3" />}
                      {dep.status === "in-progress" && <Clock className="mr-1 h-3 w-3" />}
                      {dep.status}
                    </Badge>
                  </div>
                ))}
                {dependencies.length === 0 && (
                  <div className="text-center py-8">
                    <GitBranch className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No dependencies yet</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Create task dependencies to track relationships between tasks
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blocked" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Blocked Tasks</CardTitle>
              <CardDescription>Tasks that are waiting on dependencies to be completed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {blockedTasks.map((dep) => (
                  <div
                    key={dep.id}
                    className="flex items-center justify-between p-4 border rounded-lg border-destructive/20"
                  >
                    <div className="space-y-1">
                      <div className="font-medium">{dep.taskTitle}</div>
                      <div className="text-sm text-muted-foreground">Blocked by: {dep.dependsOnTitle}</div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{dep.businessName}</Badge>
                        <Badge variant="secondary">{dep.projectName}</Badge>
                      </div>
                    </div>
                    <Badge variant="destructive">
                      <AlertTriangle className="mr-1 h-3 w-3" />
                      Blocked
                    </Badge>
                  </div>
                ))}
                {blockedTasks.length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                    <h3 className="mt-4 text-lg font-medium">No blocked tasks</h3>
                    <p className="mt-2 text-sm text-muted-foreground">All tasks are ready to proceed</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="critical" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Critical Path Analysis</CardTitle>
              <CardDescription>Tasks that directly impact project completion timeline</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {criticalPath.map((dep, index) => (
                  <div
                    key={dep.id}
                    className="flex items-center justify-between p-4 border rounded-lg border-orange-200"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-medium">
                        {index + 1}
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium">{dep.taskTitle}</div>
                        <div className="text-sm text-muted-foreground">
                          {dep.projectName} • {dep.businessName}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline">Critical Path</Badge>
                  </div>
                ))}
                {criticalPath.length === 0 && (
                  <div className="text-center py-8">
                    <Clock className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No critical path identified</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Create task dependencies to identify critical paths
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
