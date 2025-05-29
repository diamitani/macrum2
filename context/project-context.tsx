"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { generateId } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"

export interface Project {
  id: string
  name: string
  description?: string
  businessId?: string
  status: "planning" | "in-progress" | "on-hold" | "completed"
  priority: "low" | "medium" | "high"
  progress: number
  startDate: string
  dueDate: string
  createdAt: string
  updatedAt: string
  taskCount: number
  completedTasks: number
}

interface ProjectContextType {
  projects: Project[]
  isLoading: boolean
  getProject: (id: string) => Project | undefined
  getProjectsByBusiness: (businessId: string) => Project[]
  addProject: (project: Omit<Project, "id" | "createdAt" | "updatedAt" | "taskCount" | "completedTasks">) => Project
  updateProject: (id: string, project: Partial<Project>) => Project | undefined
  deleteProject: (id: string) => boolean
  incrementTaskCount: (projectId: string, completed?: boolean) => void
  decrementTaskCount: (projectId: string, completed?: boolean) => void
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined)

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load projects from localStorage on mount
  useEffect(() => {
    const loadProjects = () => {
      try {
        const savedProjects = localStorage.getItem("projects")
        if (savedProjects) {
          const parsedProjects = JSON.parse(savedProjects)
          setProjects(parsedProjects)
        }
      } catch (error) {
        console.error("Failed to load projects from localStorage:", error)
        toast({
          title: "Error",
          description: "Failed to load project data. Please refresh the page.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadProjects()
  }, [])

  // Save projects to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("projects", JSON.stringify(projects))
    }
  }, [projects, isLoading])

  const getProject = (id: string) => {
    return projects.find((project) => project.id === id)
  }

  const getProjectsByBusiness = (businessId: string) => {
    return projects.filter((project) => project.businessId === businessId)
  }

  const addProject = (
    projectData: Omit<Project, "id" | "createdAt" | "updatedAt" | "taskCount" | "completedTasks">,
  ) => {
    const now = new Date().toISOString()
    const newProject: Project = {
      id: generateId(),
      ...projectData,
      createdAt: now,
      updatedAt: now,
      taskCount: 0,
      completedTasks: 0,
    }

    setProjects((prev) => [...prev, newProject])
    return newProject
  }

  const updateProject = (id: string, projectData: Partial<Project>) => {
    let updatedProject: Project | undefined

    setProjects((prev) => {
      const updatedProjects = prev.map((project) => {
        if (project.id === id) {
          updatedProject = {
            ...project,
            ...projectData,
            updatedAt: new Date().toISOString(),
          }
          return updatedProject
        }
        return project
      })
      return updatedProjects
    })

    return updatedProject
  }

  const deleteProject = (id: string) => {
    const project = getProject(id)
    if (!project) return false

    setProjects((prev) => prev.filter((p) => p.id !== id))
    return true
  }

  const incrementTaskCount = (projectId: string, completed = false) => {
    setProjects((prev) =>
      prev.map((project) => {
        if (project.id === projectId) {
          const newTaskCount = project.taskCount + 1
          const newCompletedTasks = completed ? project.completedTasks + 1 : project.completedTasks
          const newProgress = newTaskCount > 0 ? Math.round((newCompletedTasks / newTaskCount) * 100) : 0

          return {
            ...project,
            taskCount: newTaskCount,
            completedTasks: newCompletedTasks,
            progress: newProgress,
            updatedAt: new Date().toISOString(),
          }
        }
        return project
      }),
    )
  }

  const decrementTaskCount = (projectId: string, completed = false) => {
    setProjects((prev) =>
      prev.map((project) => {
        if (project.id === projectId) {
          const newTaskCount = Math.max(0, project.taskCount - 1)
          const newCompletedTasks = completed ? Math.max(0, project.completedTasks - 1) : project.completedTasks
          const newProgress = newTaskCount > 0 ? Math.round((newCompletedTasks / newTaskCount) * 100) : 0

          return {
            ...project,
            taskCount: newTaskCount,
            completedTasks: newCompletedTasks,
            progress: newProgress,
            updatedAt: new Date().toISOString(),
          }
        }
        return project
      }),
    )
  }

  return (
    <ProjectContext.Provider
      value={{
        projects,
        isLoading,
        getProject,
        getProjectsByBusiness,
        addProject,
        updateProject,
        deleteProject,
        incrementTaskCount,
        decrementTaskCount,
      }}
    >
      {children}
    </ProjectContext.Provider>
  )
}

export function useProjects() {
  const context = useContext(ProjectContext)
  if (context === undefined) {
    throw new Error("useProjects must be used within a ProjectProvider")
  }
  return context
}
