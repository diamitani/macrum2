"use client"

import { useState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { cn, formatDate } from "@/lib/utils"
import { useTasks, type Task } from "@/context/task-context"
import { useProjects } from "@/context/project-context" // To get project list
import { toast } from "@/components/ui/use-toast"

const taskFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  projectId: z.string().min(1, "Project is required"),
  status: z.enum(["todo", "in-progress", "in-review", "completed"]),
  priority: z.enum(["low", "medium", "high"]),
  dueDate: z.date().optional(),
  dependsOn: z.array(z.string()).optional(), // Array of task IDs
})

type TaskFormData = z.infer<typeof taskFormSchema>

interface TaskFormProps {
  projectId?: string // Pre-select project if provided
  taskToEdit?: Task
  onFormSubmit: () => void // Callback after successful submission
  onCancel: () => void
}

export function TaskForm({ projectId, taskToEdit, onFormSubmit, onCancel }: TaskFormProps) {
  const { addTask, updateTask, tasks: allTasks } = useTasks()
  const { projects } = useProjects() // Assuming useProjects provides a list of projects
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [availableDependencies, setAvailableDependencies] = useState<Task[]>([])
  const [selectedDependencies, setSelectedDependencies] = useState<string[]>(taskToEdit?.dependsOn || [])

  const { control, handleSubmit, reset, watch, setValue } = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: taskToEdit?.title || "",
      description: taskToEdit?.description || "",
      projectId: taskToEdit?.projectId || projectId || "",
      status: taskToEdit?.status || "todo",
      priority: taskToEdit?.priority || "medium",
      dueDate: taskToEdit?.dueDate ? new Date(taskToEdit.dueDate) : undefined,
      dependsOn: taskToEdit?.dependsOn || [],
    },
  })

  const currentProjectId = watch("projectId")
  const currentTaskId = taskToEdit?.id

  useEffect(() => {
    // Populate available dependencies: all tasks except the current one (if editing)
    // Optionally, filter by current project or allow cross-project dependencies
    const filteredTasks = allTasks.filter((task) => task.id !== currentTaskId)
    // For simplicity, allowing any task as dependency. Could be filtered by project:
    // const filteredTasks = allTasks.filter(task => task.id !== currentTaskId && task.projectId === currentProjectId);
    setAvailableDependencies(filteredTasks)
  }, [allTasks, currentTaskId, currentProjectId])

  useEffect(() => {
    setValue("dependsOn", selectedDependencies)
  }, [selectedDependencies, setValue])

  const onSubmit = async (data: TaskFormData) => {
    setIsSubmitting(true)
    try {
      const taskPayload = {
        ...data,
        dueDate: data.dueDate?.toISOString(),
        dependsOn: selectedDependencies,
      }

      if (taskToEdit) {
        await updateTask(taskToEdit.id, taskPayload)
      } else {
        await addTask(taskPayload)
      }
      toast({ title: "Success", description: `Task ${taskToEdit ? "updated" : "created"} successfully.` })
      reset()
      setSelectedDependencies([])
      onFormSubmit()
    } catch (error) {
      console.error("Failed to save task:", error)
      toast({ title: "Error", description: "Failed to save task.", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-1">
      <Controller
        name="title"
        control={control}
        render={({ field, fieldState }) => (
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title <span className="text-red-500">*</span>
            </label>
            <Input id="title" {...field} className="mt-1" />
            {fieldState.error && <p className="mt-1 text-sm text-red-600">{fieldState.error.message}</p>}
          </div>
        )}
      />

      <Controller
        name="projectId"
        control={control}
        render={({ field, fieldState }) => (
          <div>
            <label htmlFor="projectId" className="block text-sm font-medium text-gray-700">
              Project <span className="text-red-500">*</span>
            </label>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger id="projectId" className="mt-1">
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldState.error && <p className="mt-1 text-sm text-red-600">{fieldState.error.message}</p>}
          </div>
        )}
      />

      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <Textarea id="description" {...field} className="mt-1" />
          </div>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger id="status" className="mt-1">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="in-review">In Review</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        />
        <Controller
          name="priority"
          control={control}
          render={({ field }) => (
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                Priority
              </label>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger id="priority" className="mt-1">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        />
      </div>

      <Controller
        name="dueDate"
        control={control}
        render={({ field }) => (
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
              Due Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal mt-1",
                    !field.value && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {field.value ? formatDate(field.value) : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
        )}
      />

      <div>
        <label htmlFor="dependsOn" className="block text-sm font-medium text-gray-700">
          Depends On (Prerequisites)
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" className="w-full justify-between mt-1">
              {selectedDependencies.length > 0 ? `${selectedDependencies.length} task(s) selected` : "Select tasks..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
            <Command>
              <CommandInput placeholder="Search tasks..." />
              <CommandList>
                <CommandEmpty>No tasks found.</CommandEmpty>
                <CommandGroup>
                  {availableDependencies.map((task) => (
                    <CommandItem
                      key={task.id}
                      value={task.title}
                      onSelect={() => {
                        setSelectedDependencies((prev) =>
                          prev.includes(task.id) ? prev.filter((id) => id !== task.id) : [...prev, task.id],
                        )
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedDependencies.includes(task.id) ? "opacity-100" : "opacity-0",
                        )}
                      />
                      {task.title} ({projects.find((p) => p.id === task.projectId)?.name || "Unknown Project"})
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {selectedDependencies.length > 0 && (
          <div className="mt-2 text-xs text-muted-foreground">
            Selected:{" "}
            {selectedDependencies
              .map((id) => allTasks.find((t) => t.id === id)?.title)
              .filter(Boolean)
              .join(", ")}
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (taskToEdit ? "Updating..." : "Creating...") : taskToEdit ? "Update Task" : "Create Task"}
        </Button>
      </div>
    </form>
  )
}
