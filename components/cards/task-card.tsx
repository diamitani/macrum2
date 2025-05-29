"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Calendar, Clock, MoreVertical, Edit, Trash2, AlertTriangle, CheckCircle2 } from "lucide-react"
import { TaskForm } from "@/components/forms/task-form"
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog"
import { useTasks } from "@/context/task-context"
import { useProjects } from "@/context/project-context"
import { format, isBefore, startOfDay } from "date-fns"

interface Task {
  id: string
  title: string
  description?: string
  status: "todo" | "in-progress" | "completed"
  priority: "low" | "medium" | "high"
  dueDate?: string
  projectId?: string
  assignedTo?: string
  tags?: string[]
  createdAt: string
  updatedAt: string
}

interface TaskCardProps {
  task: Task
}

export function TaskCard({ task }: TaskCardProps) {
  const { updateTask, deleteTask } = useTasks()
  const { projects } = useProjects()

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Safely handle undefined or null task
  if (!task) {
    return null
  }

  // Ensure task has required properties with defaults
  const safeTask = {
    id: task.id || "",
    title: task.title || "Untitled Task",
    description: task.description || "",
    status: task.status || "todo",
    priority: task.priority || "medium",
    dueDate: task.dueDate || null,
    projectId: task.projectId || null,
    assignedTo: task.assignedTo || null,
    tags: task.tags || [],
    createdAt: task.createdAt || new Date().toISOString(),
    updatedAt: task.updatedAt || new Date().toISOString(),
  }

  const project = safeTask.projectId && projects ? projects.find((p) => p.id === safeTask.projectId) : null

  const isOverdue =
    safeTask.dueDate && safeTask.status !== "completed" && isBefore(new Date(safeTask.dueDate), startOfDay(new Date()))

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "todo":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleStatusToggle = async () => {
    if (!updateTask) return

    const newStatus = safeTask.status === "completed" ? "todo" : "completed"
    try {
      updateTask(safeTask.id, { status: newStatus })
    } catch (error) {
      console.error("Failed to update task status:", error)
    }
  }

  const handleDelete = async () => {
    if (!deleteTask) return

    try {
      deleteTask(safeTask.id)
      setIsDeleteDialogOpen(false)
    } catch (error) {
      console.error("Failed to delete task:", error)
    }
  }

  return (
    <>
      <Card
        className={`hover:shadow-md transition-all duration-200 ${
          safeTask.status === "completed" ? "opacity-75" : ""
        } ${isOverdue ? "border-red-200 bg-red-50" : ""}`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              <Checkbox
                checked={safeTask.status === "completed"}
                onCheckedChange={handleStatusToggle}
                className="mt-1"
              />
              <div className="flex-1 min-w-0">
                <h3
                  className={`font-semibold text-gray-900 ${
                    safeTask.status === "completed" ? "line-through text-gray-500" : ""
                  }`}
                >
                  {safeTask.title}
                </h3>
                {safeTask.description && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{safeTask.description}</p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {isOverdue && <AlertTriangle className="w-4 h-4 text-red-500" />}
              {safeTask.status === "completed" && <CheckCircle2 className="w-4 h-4 text-green-500" />}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)} className="text-red-600">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Status and Priority Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge className={getStatusColor(safeTask.status)}>{safeTask.status.replace("-", " ").toUpperCase()}</Badge>
            <Badge className={getPriorityColor(safeTask.priority)}>{safeTask.priority.toUpperCase()} PRIORITY</Badge>
          </div>

          {/* Project and Due Date */}
          <div className="space-y-2">
            {project && (
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                <span>Project: {project.name}</span>
              </div>
            )}
            {safeTask.dueDate && (
              <div className={`flex items-center text-sm ${isOverdue ? "text-red-600" : "text-gray-600"}`}>
                <Clock className="w-4 h-4 mr-2" />
                <span>
                  Due: {format(new Date(safeTask.dueDate), "MMM dd, yyyy")}
                  {isOverdue && " (Overdue)"}
                </span>
              </div>
            )}
          </div>

          {/* Tags */}
          {safeTask.tags && safeTask.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {safeTask.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Assigned To */}
          {safeTask.assignedTo && (
            <div className="text-sm text-gray-600">
              <span className="font-medium">Assigned to:</span> {safeTask.assignedTo}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <TaskForm task={safeTask} onSuccess={() => setIsEditDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete Task"
        description={`Are you sure you want to delete "${safeTask.title}"? This action cannot be undone.`}
      />
    </>
  )
}
