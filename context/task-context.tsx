"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { toast } from "@/components/ui/use-toast"

export interface Task {
  id: string
  title: string
  description?: string
  status: "todo" | "in-progress" | "completed"
  priority: "low" | "medium" | "high"
  dueDate: string
  projectId?: string
  assignedTo?: string
  createdAt: string
  updatedAt: string
  completedAt?: string
  estimatedHours?: number
  actualHours?: number
  tags: string[]
}

interface TaskContextType {
  tasks: Task[]
  isLoading: boolean
  getTask: (id: string) => Task | undefined
  getTasksByProject: (projectId: string) => Task[]
  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => Task
  updateTask: (id: string, task: Partial<Task>) => Task | undefined
  deleteTask: (id: string) => boolean
  completeTask: (id: string) => void
  getTaskStats: () => {
    total: number
    completed: number
    inProgress: number
    overdue: number
    completionRate: number
  }
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

// Simple ID generator function
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load tasks from localStorage on mount
  useEffect(() => {
    const loadTasks = () => {
      try {
        const savedTasks = localStorage.getItem("macrum_tasks")
        if (savedTasks) {
          setTasks(JSON.parse(savedTasks))
        }
      } catch (error) {
        console.error("Failed to load tasks from localStorage:", error)
        toast({
          title: "Error",
          description: "Failed to load task data. Please refresh the page.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadTasks()
  }, [])

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("macrum_tasks", JSON.stringify(tasks))
    }
  }, [tasks, isLoading])

  const getTask = (id: string) => {
    return tasks.find((task) => task.id === id)
  }

  const getTasksByProject = (projectId: string) => {
    return tasks.filter((task) => task.projectId === projectId)
  }

  const addTask = (taskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString()
    const newTask: Task = {
      id: generateId(),
      ...taskData,
      createdAt: now,
      updatedAt: now,
      tags: taskData.tags || [],
    }

    setTasks((prev) => [...prev, newTask])
    toast({
      title: "Success",
      description: "Task created successfully!",
    })
    return newTask
  }

  const updateTask = (id: string, taskData: Partial<Task>) => {
    let updatedTask: Task | undefined

    setTasks((prev) => {
      const updatedTasks = prev.map((task) => {
        if (task.id === id) {
          updatedTask = {
            ...task,
            ...taskData,
            updatedAt: new Date().toISOString(),
          }
          return updatedTask
        }
        return task
      })
      return updatedTasks
    })

    if (updatedTask) {
      toast({
        title: "Success",
        description: "Task updated successfully!",
      })
    }

    return updatedTask
  }

  const deleteTask = (id: string) => {
    const taskExists = tasks.some((task) => task.id === id)

    if (taskExists) {
      setTasks((prev) => prev.filter((task) => task.id !== id))
      toast({
        title: "Success",
        description: "Task deleted successfully!",
      })
      return true
    }

    return false
  }

  const completeTask = (id: string) => {
    updateTask(id, {
      status: "completed",
      completedAt: new Date().toISOString(),
    })
  }

  const getTaskStats = () => {
    const total = tasks.length
    const completed = tasks.filter((t) => t.status === "completed").length
    const inProgress = tasks.filter((t) => t.status === "in-progress").length
    const overdue = tasks.filter((t) => {
      const dueDate = new Date(t.dueDate)
      const now = new Date()
      return dueDate < now && t.status !== "completed"
    }).length
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

    return { total, completed, inProgress, overdue, completionRate }
  }

  return (
    <TaskContext.Provider
      value={{
        tasks,
        isLoading,
        getTask,
        getTasksByProject,
        addTask,
        updateTask,
        deleteTask,
        completeTask,
        getTaskStats,
      }}
    >
      {children}
    </TaskContext.Provider>
  )
}

export function useTasks() {
  const context = useContext(TaskContext)
  if (context === undefined) {
    throw new Error("useTasks must be used within a TaskProvider")
  }
  return context
}
