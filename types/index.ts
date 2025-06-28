
export interface Client {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  address?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface Business {
  id: string
  name: string
  description?: string
  industry?: string
  website?: string
  phone?: string
  email?: string
  address?: string
  createdAt: Date
  updatedAt: Date
}

export interface Project {
  id: string
  name: string
  description?: string
  status: 'active' | 'completed' | 'on-hold' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  startDate?: Date
  endDate?: Date
  businessId?: string
  clientId?: string
  budget?: number
  createdAt: Date
  updatedAt: Date
}

export interface Task {
  id: string
  title: string
  description?: string
  status: 'todo' | 'in-progress' | 'review' | 'completed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assigneeId?: string
  projectId?: string
  dueDate?: Date
  createdAt: Date
  updatedAt: Date
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
