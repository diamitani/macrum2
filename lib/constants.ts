
export const STORAGE_KEYS = {
  CLIENTS: 'macrum_clients',
  PROJECTS: 'macrum_projects',
  TASKS: 'macrum_tasks',
  BUSINESSES: 'macrum_businesses',
  NOTEBOOK: 'macrum_notebook',
  CALENDAR_EVENTS: 'macrum_calendar_events',
} as const

export const STATUS_OPTIONS = {
  PROJECT: [
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'on-hold', label: 'On Hold' },
    { value: 'cancelled', label: 'Cancelled' },
  ],
  TASK: [
    { value: 'todo', label: 'To Do' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'review', label: 'Review' },
    { value: 'completed', label: 'Completed' },
  ],
} as const

export const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
  { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-800' },
] as const

export const EVENT_TYPES = [
  { value: 'meeting', label: 'Meeting' },
  { value: 'deadline', label: 'Deadline' },
  { value: 'reminder', label: 'Reminder' },
  { value: 'other', label: 'Other' },
] as const
