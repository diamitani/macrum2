"use client"
import { Calendar, Clock, Users } from "lucide-react"

interface Event {
  id: string
  title: string
  date: string
  time: string
  type: string
  priority: string
}

interface CalendarEventProps {
  event: Event
  onClick: () => void
  compact?: boolean
}

export function CalendarEvent({ event, onClick, compact = false }: CalendarEventProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "meeting":
        return <Users className="h-3 w-3" />
      case "task":
        return <Calendar className="h-3 w-3" />
      default:
        return <Clock className="h-3 w-3" />
    }
  }

  if (compact) {
    return (
      <div
        className={`px-1 py-0.5 text-xs rounded cursor-pointer ${getPriorityColor(event.priority)}`}
        onClick={(e) => {
          e.stopPropagation()
          onClick()
        }}
      >
        <div className="flex items-center gap-1 truncate">
          {getTypeIcon(event.type)}
          <span className="truncate">{event.title}</span>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`p-1 rounded cursor-pointer ${getPriorityColor(event.priority)}`}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
    >
      <div className="font-medium truncate">{event.title}</div>
      <div className="flex items-center gap-1 text-xs">
        <Clock className="h-3 w-3" />
        <span>{event.time}</span>
      </div>
    </div>
  )
}
