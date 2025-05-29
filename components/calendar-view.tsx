"use client"

import { useState, useEffect } from "react"
import { CalendarEvent } from "@/components/calendar-event"

interface Event {
  id: string
  title: string
  date: string
  time: string
  type: string
  priority: string
}

interface CalendarViewProps {
  view: "day" | "week" | "month"
  currentDate: Date
  events: Event[]
  onEventClick: (event: Event) => void
  onTimeSlotClick: (date: Date, time: string) => void
}

export function CalendarView({ view, currentDate, events, onEventClick, onTimeSlotClick }: CalendarViewProps) {
  const [calendarDays, setCalendarDays] = useState<Date[]>([])
  const hours = Array.from({ length: 12 }, (_, i) => i + 8) // 8 AM to 7 PM

  useEffect(() => {
    const days: Date[] = []
    const currentDay = new Date(currentDate)

    if (view === "day") {
      days.push(new Date(currentDay))
    } else if (view === "week") {
      // Set to the beginning of the week (Sunday)
      const firstDayOfWeek = new Date(currentDay)
      const day = currentDay.getDay()
      firstDayOfWeek.setDate(currentDay.getDate() - day)

      // Generate 7 days (Sunday to Saturday)
      for (let i = 0; i < 7; i++) {
        const date = new Date(firstDayOfWeek)
        date.setDate(firstDayOfWeek.getDate() + i)
        days.push(date)
      }
    } else if (view === "month") {
      // Set to the first day of the month
      const firstDayOfMonth = new Date(currentDay.getFullYear(), currentDay.getMonth(), 1)
      // Get the day of the week for the first day (0 = Sunday, 6 = Saturday)
      const firstDayOfWeek = firstDayOfMonth.getDay()

      // Add days from the previous month to start the calendar on Sunday
      const lastDayOfPrevMonth = new Date(currentDay.getFullYear(), currentDay.getMonth(), 0)
      for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        const date = new Date(lastDayOfPrevMonth)
        date.setDate(lastDayOfPrevMonth.getDate() - i)
        days.push(date)
      }

      // Add days of the current month
      const lastDayOfMonth = new Date(currentDay.getFullYear(), currentDay.getMonth() + 1, 0)
      for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
        const date = new Date(currentDay.getFullYear(), currentDay.getMonth(), i)
        days.push(date)
      }

      // Add days from the next month to complete the grid (6 rows x 7 columns = 42 cells)
      const remainingDays = 42 - days.length
      for (let i = 1; i <= remainingDays; i++) {
        const date = new Date(currentDay.getFullYear(), currentDay.getMonth() + 1, i)
        days.push(date)
      }
    }

    setCalendarDays(days)
  }, [currentDate, view])

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0]
  }

  const getEventsForDate = (date: Date) => {
    const dateStr = formatDate(date)
    return events.filter((event) => event.date === dateStr)
  }

  const renderDayView = () => {
    return (
      <div className="flex flex-col h-[600px] overflow-y-auto">
        <div className="grid grid-cols-1 divide-y">
          {hours.map((hour) => {
            const hourEvents = events.filter((event) => {
              const eventDate = event.date
              const currentDateStr = formatDate(currentDate)
              const eventStartHour = Number.parseInt(event.time.split(":")[0])
              return eventDate === currentDateStr && eventStartHour === hour
            })

            return (
              <div key={hour} className="min-h-[60px] relative">
                <div className="absolute left-0 top-0 w-16 text-xs text-muted-foreground p-1">
                  {hour % 12 === 0 ? 12 : hour % 12}:00 {hour >= 12 ? "PM" : "AM"}
                </div>
                <div
                  className="ml-16 min-h-[60px] p-1 hover:bg-muted/50 cursor-pointer"
                  onClick={() => {
                    const date = new Date(currentDate)
                    onTimeSlotClick(date, `${hour}:00`)
                  }}
                >
                  {hourEvents.map((event) => (
                    <CalendarEvent key={event.id} event={event} onClick={() => onEventClick(event)} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderWeekView = () => {
    return (
      <div className="flex flex-col h-[600px] overflow-y-auto">
        <div className="grid grid-cols-8 divide-x">
          {/* Time column */}
          <div className="col-span-1">
            <div className="h-10"></div> {/* Empty cell for the header row */}
            {hours.map((hour) => (
              <div key={hour} className="h-[60px] text-xs text-muted-foreground p-1">
                {hour % 12 === 0 ? 12 : hour % 12}:00 {hour >= 12 ? "PM" : "AM"}
              </div>
            ))}
          </div>

          {/* Days columns */}
          {calendarDays.map((day) => (
            <div key={day.toISOString()} className="col-span-1">
              <div className="h-10 text-center p-2 font-medium border-b">
                <div>{day.toLocaleDateString("en-US", { weekday: "short" })}</div>
                <div className="text-sm">{day.getDate()}</div>
              </div>
              {hours.map((hour) => {
                const hourEvents = events.filter((event) => {
                  const eventDate = event.date
                  const dayStr = formatDate(day)
                  const eventStartHour = Number.parseInt(event.time.split(":")[0])
                  return eventDate === dayStr && eventStartHour === hour
                })

                return (
                  <div
                    key={hour}
                    className="h-[60px] p-1 hover:bg-muted/50 cursor-pointer"
                    onClick={() => {
                      const date = new Date(day)
                      onTimeSlotClick(date, `${hour}:00`)
                    }}
                  >
                    {hourEvents.map((event) => (
                      <CalendarEvent key={event.id} event={event} onClick={() => onEventClick(event)} />
                    ))}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderMonthView = () => {
    // Create a 6x7 grid for the month view
    const weeks = []
    for (let i = 0; i < calendarDays.length; i += 7) {
      weeks.push(calendarDays.slice(i, i + 7))
    }

    return (
      <div className="grid grid-cols-7 gap-1">
        {/* Day headers */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center p-2 font-medium text-sm">
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {calendarDays.map((day, index) => {
          const isCurrentMonth = day.getMonth() === currentDate.getMonth()
          const isToday =
            day.getDate() === new Date().getDate() &&
            day.getMonth() === new Date().getMonth() &&
            day.getFullYear() === new Date().getFullYear()
          const dayEvents = getEventsForDate(day)

          return (
            <div
              key={index}
              className={`min-h-[100px] p-1 border rounded-md ${
                isCurrentMonth ? "" : "text-muted-foreground bg-muted/30"
              } ${isToday ? "border-primary" : ""}`}
              onClick={() => onTimeSlotClick(day, "9:00")}
            >
              <div className="text-right p-1">
                <span
                  className={`text-sm inline-block rounded-full w-6 h-6 text-center leading-6 ${
                    isToday ? "bg-primary text-primary-foreground" : ""
                  }`}
                >
                  {day.getDate()}
                </span>
              </div>
              <div className="space-y-1 overflow-y-auto max-h-[80px]">
                {dayEvents.map((event) => (
                  <CalendarEvent key={event.id} event={event} onClick={() => onEventClick(event)} compact />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="border rounded-md">
      {view === "day" && renderDayView()}
      {view === "week" && renderWeekView()}
      {view === "month" && renderMonthView()}
    </div>
  )
}
