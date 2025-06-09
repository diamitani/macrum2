"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { generateId } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast" // Assuming useToast is available

export interface Task {
  id: string
  title: string
  description?: string
  status: "todo" | "in-progress" | "in-review" | "completed"
  priority: "low" | "medium" | "high"
  dueDate?: string
  createdAt: string
  updatedAt: string
  projectId: string // Ensure every task is linked to a project
  businessId?: string // Optional, if tasks can be directly linked or via project
  assignedTo?: string[] // User IDs
  tags?: string[]
  dependsOn?: string[] // Array of task IDs this task depends on
  // Add any other relevant fields
}

interface TaskContextType {
  tasks: Task[]
  isLoading: boolean
  addTask: (taskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => Promise<Task | null>
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<Task | null>
  deleteTask: (taskId: string) => Promise<boolean>
  getTaskById: (taskId: string) => Task | undefined
  getTasksByProjectId: (projectId: string) => Task[]
  getTasksByBusinessId: (businessId: string) => Task[]
  getDependentTasks: (taskId: string) => Task[] // Tasks that depend on this task
  getPrerequisiteTasks: (taskId: string) => Task[] // Tasks this task depends on
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

const TASK_STORAGE_KEY = "macrum_tasks"

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem(TASK_STORAGE_KEY)
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks))
      }
    } catch (error) {
      console.error("Failed to load tasks from localStorage:", error)
      toast({
        title: "Error",
        description: "Could not load tasks. Your task data might be corrupted.",
        variant: "destructive",
      })
      localStorage.removeItem(TASK_STORAGE_KEY) // Clear corrupted data
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!isLoading) {
      // Only save if initial load is complete
      try {
        localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(tasks))
      } catch (error) {
        console.error("Failed to save tasks to localStorage:", error)
        toast({
          title: "Error",
          description: "Could not save tasks. Please try again.",
          variant: "destructive",
        })
      }
    }
  }, [tasks, isLoading])

  const addTask = useCallback(async (taskData: Omit<Task, "id" | "createdAt" | "updatedAt">): Promise<Task | null> => {
    if (!taskData.projectId) {
      toast({ title: "Error", description: "Task must be associated with a project.", variant: "destructive" })
      return null
    }
    const newTask: Task = {
      id: generateId(),
      ...taskData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      dependsOn: taskData.dependsOn?.filter((depId) => depId !== undefined && depId !== null) || [], // Ensure valid IDs
    }
    setTasks((prevTasks) => [...prevTasks, newTask])
    toast({ title: "Success", description: `Task "${newTask.title}" created.` })
    return newTask
  }, [])

  const updateTask = useCallback(async (taskId: string, updates: Partial<Task>): Promise<Task | null> => {
    let updatedTask: Task | null = null
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          updatedTask = {
            ...task,
            ...updates,
            dependsOn: updates.dependsOn?.filter((depId) => depId !== undefined && depId !== null) || task.dependsOn, // Ensure valid IDs
            updatedAt: new Date().toISOString(),
          }
          return updatedTask
        }
        return task
      }),
    )
    if (updatedTask) {
      toast({ title: "Success", description: `Task "${updatedTask.title}" updated.` })
    } else {
      toast({ title: "Error", description: "Task not found for update.", variant: "destructive" })
    }
    return updatedTask
  }, [])

  const deleteTask = useCallback(
    async (taskId: string): Promise<boolean> => {
      const taskToDelete = tasks.find((t) => t.id === taskId)
      if (!taskToDelete) {
        toast({ title: "Error", description: "Task not found for deletion.", variant: "destructive" })
        return false
      }

      setTasks((prevTasks) => {
        // Remove the task itself
        const remainingTasks = prevTasks.filter((task) => task.id !== taskId)
        // Remove this task from other tasks' dependsOn arrays
        return remainingTasks.map((task) => ({
          ...task,
          dependsOn: task.dependsOn?.filter((depId) => depId !== taskId) || [],
        }))
      })
      toast({ title: "Success", description: `Task "${taskToDelete.title}" deleted.` })
      return true
    },
    [tasks],
  )

  const getTaskById = useCallback((taskId: string) => tasks.find((task) => task.id === taskId), [tasks])
  const getTasksByProjectId = useCallback(
    (projectId: string) => tasks.filter((task) => task.projectId === projectId),
    [tasks],
  )
  const getTasksByBusinessId = useCallback(
    (businessId: string) => tasks.filter((task) => task.businessId === businessId),
    [tasks],
  )

  const getDependentTasks = useCallback(
    (taskId: string) => {
      return tasks.filter((task) => task.dependsOn?.includes(taskId))
    },
    [tasks],
  )

  const getPrerequisiteTasks = useCallback(
    (taskId: string) => {
      const task = getTaskById(taskId)
      if (!task || !task.dependsOn) return []
      return tasks.filter((t) => task.dependsOn!.includes(t.id))
    },
    [tasks, getTaskById],
  )

  return (
    <TaskContext.Provider
      value={{
        tasks,
        isLoading,
        addTask,
        updateTask,
        deleteTask,
        getTaskById,
        getTasksByProjectId,
        getTasksByBusinessId,
        getDependentTasks,
        getPrerequisiteTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  )
}

export const useTasks = () => {
  const context = useContext(TaskContext)
  if (context === undefined) {
    throw new Error("useTasks must be used within a TaskProvider")
  }
  return context
}
