"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { toast } from "@/components/ui/use-toast"

// Generate a simple ID function to avoid external dependencies
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export interface Project {
  id: string
  name: string
  description: string
  businessId: string
  clientId?: string
  status: "planning" | "in-progress" | "in-review" | "completed"
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
  refreshProjects: () => void
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined)

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load projects from localStorage on mount
  useEffect(() => {
    const loadProjects = () => {
      try {
        const savedProjects = localStorage.getItem("macrum_projects")
        if (savedProjects) {
          const parsedProjects = JSON.parse(savedProjects)
          // Validate and sanitize the data
          const validProjects = parsedProjects.filter(
            (project: any) =>
              project && typeof project === "object" && project.id && project.name && project.businessId,
          )
          setProjects(validProjects)
        }
      } catch (error) {
        console.error("Failed to load projects from localStorage:", error)
        // Clear corrupted data
        localStorage.removeItem("macrum_projects")
        toast({
          title: "Data Recovery",
          description: "Project data was corrupted and has been reset. Please recreate your projects.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadProjects()
  }, [])

  // Save projects to localStorage with error handling
  const saveProjects = (projectsToSave: Project[]) => {
    try {
      localStorage.setItem("macrum_projects", JSON.stringify(projectsToSave))
    } catch (error) {
      console.error("Failed to save projects to localStorage:", error)
      toast({
        title: "Save Error",
        description: "Failed to save project data. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Save projects whenever they change
  useEffect(() => {
    if (!isLoading && projects.length >= 0) {
      saveProjects(projects)
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
    try {
      const now = new Date().toISOString()
      const newProject: Project = {
        id: generateId(),
        ...projectData,
        createdAt: now,
        updatedAt: now,
        taskCount: 0,
        completedTasks: 0,
        progress: 0,
      }

      setProjects((prev) => {
        const updated = [...prev, newProject]
        saveProjects(updated)
        return updated
      })

      toast({
        title: "Success",
        description: `Project "${newProject.name}" has been created successfully.`,
      })

      return newProject
    } catch (error) {
      console.error("Failed to add project:", error)
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      })
      throw error
    }
  }

  const updateProject = (id: string, projectData: Partial<Project>) => {
    try {
      let updatedProject: Project | undefined

      setProjects((prev) => {
        const updated = prev.map((project) => {
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
        saveProjects(updated)
        return updated
      })

      if (updatedProject) {
        toast({
          title: "Success",
          description: `Project "${updatedProject.name}" has been updated.`,
        })
      }

      return updatedProject
    } catch (error) {
      console.error("Failed to update project:", error)
      toast({
        title: "Error",
        description: "Failed to update project. Please try again.",
        variant: "destructive",
      })
      return undefined
    }
  }

  const deleteProject = (id: string) => {
    try {
      const project = getProject(id)
      if (!project) return false

      setProjects((prev) => {
        const updated = prev.filter((p) => p.id !== id)
        saveProjects(updated)
        return updated
      })

      toast({
        title: "Success",
        description: `Project "${project.name}" has been deleted.`,
      })

      return true
    } catch (error) {
      console.error("Failed to delete project:", error)
      toast({
        title: "Error",
        description: "Failed to delete project. Please try again.",
        variant: "destructive",
      })
      return false
    }
  }

  const incrementTaskCount = (projectId: string, completed = false) => {
    setProjects((prev) => {
      const updated = prev.map((project) => {
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
      })
      saveProjects(updated)
      return updated
    })
  }

  const decrementTaskCount = (projectId: string, completed = false) => {
    setProjects((prev) => {
      const updated = prev.map((project) => {
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
      })
      saveProjects(updated)
      return updated
    })
  }

  const refreshProjects = () => {
    setIsLoading(true)
    try {
      const savedProjects = localStorage.getItem("macrum_projects")
      if (savedProjects) {
        const parsedProjects = JSON.parse(savedProjects)
        setProjects(parsedProjects)
      }
    } catch (error) {
      console.error("Failed to refresh projects:", error)
    } finally {
      setIsLoading(false)
    }
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
        refreshProjects,
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
`