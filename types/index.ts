
export interface Client {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  address?: string
  notes?: string
  businessId?: string
  /** Twenty CRM record id after syncing (set via the Twenty sync button). */
  twentyId?: string
  createdAt: Date
  updatedAt: Date
}

export interface Business {
  id: string
  name: string
  description: string
  industry: string
  website?: string
  phone?: string
  email?: string
  address?: string
  status: "active" | "inactive" | "planning"
  createdAt: Date | string
  updatedAt: Date | string
  projectCount: number
  activeProjects: number
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
  startDate: Date | string
  dueDate: Date | string
  createdAt: Date | string
  updatedAt: Date | string
  taskCount: number
  completedTasks: number
}

export interface Task {
  id: string
  title: string
  description?: string
  status: "todo" | "in-progress" | "in-review" | "completed"
  priority: "low" | "medium" | "high"
  dueDate?: string | Date
  createdAt: string | Date
  updatedAt: string | Date
  projectId: string
  businessId?: string
  assignedTo?: string[]
  tags?: string[]
  dependsOn?: string[]
}

export interface CalendarEvent {
  id: string
  title: string
  description?: string
  startDate: Date
  endDate: Date
  allDay?: boolean
  type: 'meeting' | 'deadline' | 'reminder' | 'other'
  projectId?: string
  clientId?: string
}

export interface NotebookEntry {
  id: string
  title: string
  content: string
  tags?: string[]
  projectId?: string
  clientId?: string
  createdAt: Date
  updatedAt: Date
}
