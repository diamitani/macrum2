"use client"

import { DndContext, type DragEndEvent, PointerSensor, useSensor, useSensors, useDroppable } from "@dnd-kit/core"
import { useDraggable } from "@dnd-kit/core"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Flag } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTasks, type Task } from "@/context/task-context"

type TaskStatus = Task["status"]

const COLUMNS: { value: TaskStatus; label: string }[] = [
  { value: "todo", label: "Todo" },
  { value: "in-progress", label: "In Progress" },
  { value: "in-review", label: "In Review" },
  { value: "completed", label: "Completed" },
]

const priorityVariant: Record<Task["priority"], "default" | "secondary" | "destructive"> = {
  low: "secondary",
  medium: "default",
  high: "destructive",
}

function TaskBoardCard({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task.id,
    data: { task },
  })

  return (
    <Card
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn("cursor-grab active:cursor-grabbing touch-none", isDragging && "opacity-50 shadow-lg ring-2 ring-primary")}
    >
      <CardContent className="p-3 space-y-2">
        <p className="text-sm font-medium line-clamp-2">{task.title}</p>
        {task.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
        )}
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Badge variant={priorityVariant[task.priority]} className="text-[10px]">
            <Flag className="mr-1 h-3 w-3" />
            {task.priority}
          </Badge>
          {task.dueDate && (
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="h-3 w-3" />
              {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function TaskBoardColumn({
  status,
  label,
  count,
  children,
}: {
  status: TaskStatus
  label: string
  count: number
  children: React.ReactNode
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status })

  return (
    <div className="flex min-h-[420px] w-72 shrink-0 flex-col rounded-lg border bg-muted/40">
      <div className="flex items-center gap-2 px-3 py-3 border-b">
        <h3 className="text-sm font-semibold">{label}</h3>
        <Badge variant="secondary">{count}</Badge>
      </div>
      <div
        ref={setNodeRef}
        className={cn("flex flex-1 flex-col gap-2 p-2 transition-colors", isOver && "rounded-b-lg bg-primary/10")}
      >
        {children}
      </div>
    </div>
  )
}

interface TaskBoardProps {
  tasks: Task[]
  projectId?: string
}

export function TaskBoard({ tasks, projectId }: TaskBoardProps) {
  const { updateTask } = useTasks()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  )

  const visibleTasks = projectId && projectId !== "all" ? tasks.filter((t) => t.projectId === projectId) : tasks

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return
    const newStatus = over.id as TaskStatus
    const task = visibleTasks.find((t) => t.id === active.id)
    if (task && task.status !== newStatus) {
      await updateTask(task.id, { status: newStatus })
    }
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((col) => {
          const columnTasks = visibleTasks.filter((t) => t.status === col.value)
          return (
            <TaskBoardColumn key={col.value} status={col.value} label={col.label} count={columnTasks.length}>
              {columnTasks.map((task) => (
                <TaskBoardCard key={task.id} task={task} />
              ))}
            </TaskBoardColumn>
          )
        })}
      </div>
    </DndContext>
  )
}
