"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { MoreHorizontal, Trash, Loader2, CalendarClock, FolderKanban } from "lucide-react"

interface Task {
  id: string
  title: string
  description: string
  status: string
  priority: string
  dueDate: string
  projectId?: string
  projectName?: string
}

interface TaskItemProps {
  task: Task
  onDelete: () => Promise<void> | void
  showProject?: boolean
}

export function TaskItem({ task, onDelete, showProject = true }: TaskItemProps) {
  const [isChecked, setIsChecked] = useState(task.status === "completed")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  const handleCheckChange = (checked: boolean) => {
    setIsChecked(checked)
    // In a real app, you would update the task status in your database
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await onDelete()
      toast({
        title: "Task deleted",
        description: "The task has been deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting task:", error)
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
    }
  }

  return (
    <>
      <Card className={isChecked ? "opacity-60" : ""}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Checkbox
              id={`task-${task.id}`}
              checked={isChecked}
              onCheckedChange={(checked) => handleCheckChange(checked as boolean)}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <label
                  htmlFor={`task-${task.id}`}
                  className={`font-medium ${isChecked ? "line-through text-muted-foreground" : ""}`}
                >
                  {task.title}
                </label>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      task.priority === "high" ? "destructive" : task.priority === "medium" ? "default" : "secondary"
                    }
                  >
                    {task.priority}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>Edit task</DropdownMenuItem>
                      <DropdownMenuItem>View details</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={() => setIsDeleteDialogOpen(true)}>
                        <Trash className="mr-2 h-4 w-4" />
                        Delete task
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mt-2">
                <div className="flex items-center">
                  <CalendarClock className="mr-1 h-3 w-3" />
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </div>
                {showProject && task.projectId && task.projectName && (
                  <div className="flex items-center">
                    <FolderKanban className="mr-1 h-3 w-3" />
                    <Link href={`/projects/${task.projectId}`} className="hover:underline">
                      {task.projectName}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
