"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarView } from "@/components/calendar-view"
import { CalendarFilters } from "@/components/calendar-filters"
import { TaskCreateDialog } from "@/components/task-create-dialog"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { useTasks } from "@/context/task-context"

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<"day" | "week" | "month">("week")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const { tasks } = useTasks()
  const router = useRouter()

  // Events come from tasks with due dates — the only dated records the app stores.
  const events = useMemo(
    () =>
      tasks
        .filter((t) => t.dueDate)
        .map((t) => ({
          id: t.id,
          title: t.title,
          date: new Date(t.dueDate as string).toISOString().split("T")[0],
          time: "All day",
          type: "task",
          priority: t.priority ?? "medium",
        })),
    [tasks]
  )

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
          <p className="text-muted-foreground">Tasks with due dates, on your calendar</p>
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
                onEventClick={() => router.push("/tasks")}
                onTimeSlotClick={() => {
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
