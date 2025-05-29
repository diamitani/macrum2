"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarView } from "@/components/calendar-view"
import { CalendarFilters } from "@/components/calendar-filters"
import { TaskCreateDialog } from "@/components/task-create-dialog"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"

// Sample events data - in a real app, this would come from a database
const events = [
  {
    id: "1",
    title: "Client Meeting: Acme Corp",
    date: "2023-05-15",
    time: "10:00 AM - 11:30 AM",
    type: "meeting",
    priority: "high",
  },
  {
    id: "2",
    title: "Project Kickoff: Website Redesign",
    date: "2023-05-15",
    time: "2:00 PM - 3:00 PM",
    type: "meeting",
    priority: "high",
  },
  {
    id: "3",
    title: "Complete Sales Proposal",
    date: "2023-05-16",
    time: "9:00 AM - 12:00 PM",
    type: "task",
    priority: "high",
  },
  {
    id: "4",
    title: "Weekly Team Standup",
    date: "2023-05-17",
    time: "9:30 AM - 10:00 AM",
    type: "meeting",
    priority: "medium",
  },
  {
    id: "5",
    title: "Review Marketing Materials",
    date: "2023-05-17",
    time: "1:00 PM - 3:00 PM",
    type: "task",
    priority: "medium",
  },
  {
    id: "6",
    title: "Client Call: Globex Industries",
    date: "2023-05-18",
    time: "11:00 AM - 12:00 PM",
    type: "meeting",
    priority: "high",
  },
  {
    id: "7",
    title: "Prepare Monthly Report",
    date: "2023-05-19",
    time: "2:00 PM - 5:00 PM",
    type: "task",
    priority: "high",
  },
]

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<"day" | "week" | "month">("week")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const handlePrevious = () => {
    const newDate = new Date(currentDate)
    if (view === "day") {
      newDate.setDate(newDate.getDate() - 1)
    } else if (view === "week") {
      newDate.setDate(newDate.getDate() - 7)
    } else {
      newDate.setMonth(newDate.getMonth() - 1)
    }
    setCurrentDate(newDate)
  }

  const handleNext = () => {
    const newDate = new Date(currentDate)
    if (view === "day") {
      newDate.setDate(newDate.getDate() + 1)
    } else if (view === "week") {
      newDate.setDate(newDate.getDate() + 7)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">Schedule and manage your tasks and meetings</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Event
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={handlePrevious}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={handleToday}>
                Today
              </Button>
              <Button variant="outline" size="icon" onClick={handleNext}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <div className="text-lg font-semibold">
                {currentDate.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                  day: view === "month" ? undefined : "numeric",
                })}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Tabs value={view} onValueChange={(v) => setView(v as "day" | "week" | "month")}>
                <TabsList>
                  <TabsTrigger value="day">Day</TabsTrigger>
                  <TabsTrigger value="week">Week</TabsTrigger>
                  <TabsTrigger value="month">Month</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-64 lg:w-72">
              <CalendarFilters />
            </div>
            <div className="flex-1">
              <CalendarView
                view={view}
                currentDate={currentDate}
                events={events}
                onEventClick={(event) => console.log("Event clicked:", event)}
                onTimeSlotClick={(date, time) => {
                  console.log("Time slot clicked:", date, time)
                  setIsCreateDialogOpen(true)
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <TaskCreateDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} defaultDate={currentDate} />
    </div>
  )
}
