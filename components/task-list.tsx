
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { TaskItem } from "@/components/task-item"
import { TaskCreateDialog } from "@/components/task-create-dialog"
import { useTasks } from "@/context/task-context"
import { useProjects } from "@/context/project-context"

interface TaskListProps {
  projectId: string
}

export function TaskList({ projectId }: TaskListProps) {
  const { getTasksByProjectId, isLoading } = useTasks()
  const { getProject } = useProjects()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const tasks = getTasksByProjectId(projectId)
  const project = getProject(projectId)

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading tasks...</div>
  }

  if (!project) {
    return <div className="flex justify-center p-8">Project not found</div>
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
          defaultProjectId={projectId}
        />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Tasks</h2>
        <Button size="sm" onClick={() => setIsCreateDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} showProject={false} />
      ))}

      <TaskCreateDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        defaultProjectId={projectId}
      />
    </div>
  )
}
