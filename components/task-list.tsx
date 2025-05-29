"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { TaskItem } from "@/components/task-item"
import { TaskCreateDialog } from "@/components/task-create-dialog"
import { useToast } from "@/components/ui/use-toast"

interface TaskListProps {
  projectId: string
}

export function TaskList({ projectId }: TaskListProps) {
  const [tasks, setTasks] = useState<any[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const { toast } = useToast()

  const handleDeleteTask = async (taskId: string) => {
    // In a real app, you would call your API to delete the task
    setTasks(tasks.filter((task) => task.id !== taskId))

    toast({
      title: "Task deleted",
      description: "The task has been deleted successfully",
    })
  }

  const handleCreateTask = (newTask: any) => {
    // Add the project ID to the task
    const taskWithProject = {
      ...newTask,
      projectId,
    }

    setTasks([taskWithProject, ...tasks])
    setIsCreateDialogOpen(false)

    toast({
      title: "Task created",
      description: "The task has been created successfully",
    })
  }

  if (tasks.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center p-8 border rounded-lg">
          <div className="text-center">
            <h3 className="mt-4 text-lg font-medium">No tasks found</h3>
            <p className="mt-2 text-sm text-muted-foreground">Add tasks to track progress on this project</p>
            <Button className="mt-4" onClick={() => setIsCreateDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Your First Task
            </Button>
          </div>
        </div>

        <TaskCreateDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onCreateTask={handleCreateTask}
        />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onDelete={() => handleDeleteTask(task.id)} showProject={false} />
      ))}

      <TaskCreateDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateTask={handleCreateTask}
      />
    </div>
  )
}
