"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, Search, Filter, List, Columns3 } from "lucide-react"
import { TaskItem } from "@/components/task-item"
import { TaskBoard } from "@/components/task-board"
import { TaskCreateDialog } from "@/components/task-create-dialog"
import { useTasks } from "@/context/task-context"
import { useProjects } from "@/context/project-context"

type ViewMode = "list" | "board"

export default function TasksPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [projectFilter, setProjectFilter] = useState("all")
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const { tasks, isLoading } = useTasks()
  const { projects } = useProjects()

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || task.status === statusFilter
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter
    const matchesProject = projectFilter === "all" || task.projectId === projectFilter

    return matchesSearch && matchesStatus && matchesPriority && matchesProject
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="text-lg">Loading tasks...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">Manage all your tasks across different projects</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-md border p-1" role="tablist" aria-label="View mode">
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              aria-pressed={viewMode === "list"}
            >
              <List className="mr-1 h-4 w-4" />
              List
            </Button>
            <Button
              variant={viewMode === "board" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("board")}
              aria-pressed={viewMode === "board"}
            >
              <Columns3 className="mr-1 h-4 w-4" />
              Board
            </Button>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1 md:max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="todo">Todo</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="in-review">In Review</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Select value={projectFilter} onValueChange={setProjectFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">
            {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
          </h2>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 border rounded-lg">
            <div className="text-center">
              <h3 className="mt-4 text-lg font-medium">
                {tasks.length === 0 ? "No tasks found" : "No tasks match your filters"}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {tasks.length === 0 
                  ? "Create your first task to get started" 
                  : "Try adjusting your search or filter criteria"
                }
              </p>
              {tasks.length === 0 && (
                <Button className="mt-4" onClick={() => setIsCreateDialogOpen(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Your First Task
                </Button>
              )}
            </div>
          </div>
        ) : viewMode === "board" ? (
          <TaskBoard tasks={filteredTasks} />
        ) : (
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <TaskItem key={task.id} task={task} showProject={true} />
            ))}
          </div>
        )}
      </div>

      <TaskCreateDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  )
}