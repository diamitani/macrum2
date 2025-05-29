"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Search, Filter } from "lucide-react"
import { TaskItem } from "@/components/task-item"
import { TaskCreateDialog } from "@/components/task-create-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function TasksPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedPriority, setSelectedPriority] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [tasks, setTasks] = useState<any[]>([])

  // Filter tasks based on search query, status, and priority
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = selectedStatus === "all" || task.status === selectedStatus
    const matchesPriority = selectedPriority === "all" || task.priority === selectedPriority

    return matchesSearch && matchesStatus && matchesPriority
  })

  const handleDeleteTask = async (taskId: string) => {
    // In a real app, you would call your API to delete the task
    setTasks(tasks.filter((task) => task.id !== taskId))
  }

  const handleCreateTask = (newTask: any) => {
    setTasks([newTask, ...tasks])
    setIsCreateDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">Manage all your tasks across different projects</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search tasks..."
            className="w-full pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedPriority} onValueChange={setSelectedPriority}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Filter Tasks</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="font-normal text-xs text-muted-foreground">By Project</DropdownMenuLabel>
              <DropdownMenuCheckboxItem checked={true}>All Projects</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Sales Campaign</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Website Redesign</DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="font-normal text-xs text-muted-foreground">By Due Date</DropdownMenuLabel>
              <DropdownMenuCheckboxItem>Overdue</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Due Today</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Due This Week</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs defaultValue="all" onValueChange={setSelectedStatus}>
        <TabsList>
          <TabsTrigger value="all">All Tasks</TabsTrigger>
          <TabsTrigger value="not-started">Not Started</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          <TasksList tasks={filteredTasks} onDelete={handleDeleteTask} />
        </TabsContent>
        <TabsContent value="not-started" className="mt-6">
          <TasksList
            tasks={filteredTasks.filter((task) => task.status === "not-started")}
            onDelete={handleDeleteTask}
          />
        </TabsContent>
        <TabsContent value="in-progress" className="mt-6">
          <TasksList
            tasks={filteredTasks.filter((task) => task.status === "in-progress")}
            onDelete={handleDeleteTask}
          />
        </TabsContent>
        <TabsContent value="completed" className="mt-6">
          <TasksList tasks={filteredTasks.filter((task) => task.status === "completed")} onDelete={handleDeleteTask} />
        </TabsContent>
      </Tabs>

      <TaskCreateDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateTask={handleCreateTask}
      />
    </div>
  )
}

function TasksList({ tasks, onDelete }: { tasks: any[]; onDelete: (id: string) => void }) {
  if (tasks.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 border rounded-lg">
        <div className="text-center">
          <h3 className="mt-4 text-lg font-medium">No tasks found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Create a new task or adjust your filters to see more results
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onDelete={() => onDelete(task.id)} />
      ))}
    </div>
  )
}
