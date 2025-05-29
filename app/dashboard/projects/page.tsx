"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useProjects } from "@/context/project-context"
import { useBusinesses } from "@/context/business-context"
import { ProjectForm } from "@/components/forms/project-form"
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog"
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Building2,
  Clock,
  CheckCircle2,
  Circle,
  Pause,
  AlertCircle,
} from "lucide-react"
import { format, isAfter, isBefore, parseISO } from "date-fns"
import { cn } from "@/lib/utils"

type SortField = "name" | "startDate" | "endDate" | "status" | "progress"
type SortOrder = "asc" | "desc"

export default function ProjectsPage() {
  const { projects, deleteProject, isLoading } = useProjects()
  const { businesses } = useBusinesses()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [businessFilter, setBusinessFilter] = useState<string>("all")
  const [sortField, setSortField] = useState<SortField>("name")
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc")
  const [dateRangeFilter, setDateRangeFilter] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<any>(null)
  const [deletingProject, setDeletingProject] = useState<any>(null)

  // Filter and sort projects
  const filteredAndSortedProjects = useMemo(() => {
    const filtered = projects.filter((project) => {
      // Search filter
      const matchesSearch =
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchTerm.toLowerCase())

      // Status filter
      const matchesStatus = statusFilter === "all" || project.status === statusFilter

      // Business filter
      const matchesBusiness = businessFilter === "all" || project.businessId === businessFilter

      // Date range filter
      let matchesDateRange = true
      if (dateRangeFilter !== "all") {
        const now = new Date()
        const projectStart = parseISO(project.startDate)
        const projectEnd = parseISO(project.dueDate)

        switch (dateRangeFilter) {
          case "upcoming":
            matchesDateRange = isAfter(projectStart, now)
            break
          case "current":
            matchesDateRange = isBefore(projectStart, now) && isAfter(projectEnd, now)
            break
          case "overdue":
            matchesDateRange = isBefore(projectEnd, now) && project.status !== "completed"
            break
          case "completed":
            matchesDateRange = project.status === "completed"
            break
        }
      }

      return matchesSearch && matchesStatus && matchesBusiness && matchesDateRange
    })

    // Sort projects
    filtered.sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (sortField) {
        case "name":
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case "startDate":
          aValue = new Date(a.startDate)
          bValue = new Date(b.startDate)
          break
        case "endDate":
          aValue = new Date(a.dueDate)
          bValue = new Date(b.dueDate)
          break
        case "status":
          aValue = a.status
          bValue = b.status
          break
        case "progress":
          aValue = a.progress
          bValue = b.progress
          break
        default:
          return 0
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1
      return 0
    })

    return filtered
  }, [projects, searchTerm, statusFilter, businessFilter, dateRangeFilter, sortField, sortOrder])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-green-600" />
      case "in-progress":
        return <Circle className="w-4 h-4 text-blue-600" />
      case "on-hold":
        return <Pause className="w-4 h-4 text-yellow-600" />
      case "planning":
        return <Clock className="w-4 h-4 text-gray-600" />
      default:
        return <AlertCircle className="w-4 h-4 text-red-600" />
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default"
      case "in-progress":
        return "secondary"
      case "on-hold":
        return "outline"
      case "planning":
        return "outline"
      default:
        return "destructive"
    }
  }

  const handleDeleteProject = async (project: any) => {
    const success = deleteProject(project.id)
    if (success) {
      setDeletingProject(null)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-64 bg-gray-200 rounded animate-pulse mt-2" />
          </div>
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">Manage and track your projects across all businesses</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>Add a new project to your portfolio</DialogDescription>
            </DialogHeader>
            <ProjectForm onSuccess={() => setIsCreateDialogOpen(false)} onCancel={() => setIsCreateDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="planning">Planning</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="on-hold">On Hold</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={businessFilter} onValueChange={setBusinessFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Business" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Businesses</SelectItem>
              {businesses.map((business) => (
                <SelectItem key={business.id} value={business.id}>
                  {business.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={dateRangeFilter} onValueChange={setDateRangeFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Timeline" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="current">Current</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={`${sortField}-${sortOrder}`}
            onValueChange={(value) => {
              const [field, order] = value.split("-")
              setSortField(field as SortField)
              setSortOrder(order as SortOrder)
            }}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-asc">Name A-Z</SelectItem>
              <SelectItem value="name-desc">Name Z-A</SelectItem>
              <SelectItem value="startDate-asc">Start Date ↑</SelectItem>
              <SelectItem value="startDate-desc">Start Date ↓</SelectItem>
              <SelectItem value="endDate-asc">End Date ↑</SelectItem>
              <SelectItem value="endDate-desc">End Date ↓</SelectItem>
              <SelectItem value="progress-desc">Progress ↓</SelectItem>
              <SelectItem value="progress-asc">Progress ↑</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredAndSortedProjects.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Building2 className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || statusFilter !== "all" || businessFilter !== "all" || dateRangeFilter !== "all"
                ? "No projects found"
                : "No projects yet"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || statusFilter !== "all" || businessFilter !== "all" || dateRangeFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Create your first project to get started"}
            </p>
            {!searchTerm && statusFilter === "all" && businessFilter === "all" && dateRangeFilter === "all" && (
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Project
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedProjects.map((project) => {
            const business = businesses.find((b) => b.id === project.businessId)
            const isOverdue = isBefore(parseISO(project.dueDate), new Date()) && project.status !== "completed"

            return (
              <Card
                key={project.id}
                className={cn("transition-all hover:shadow-md", isOverdue && "border-red-200 bg-red-50/50")}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <CardTitle className="text-lg leading-tight">{project.name}</CardTitle>
                      {business && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Building2 className="w-3 h-3 mr-1" />
                          {business.name}
                        </div>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => {
                            /* Navigate to project detail */
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setEditingProject(project)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Project
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setDeletingProject(project)} className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Project
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {project.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(project.status)}
                      <Badge variant={getStatusBadgeVariant(project.status)}>
                        {project.status.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </Badge>
                    </div>
                    {isOverdue && (
                      <Badge variant="destructive" className="text-xs">
                        Overdue
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Start Date</div>
                      <div className="font-medium">{format(parseISO(project.startDate), "MMM dd, yyyy")}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Due Date</div>
                      <div className={cn("font-medium", isOverdue && "text-red-600")}>
                        {format(parseISO(project.dueDate), "MMM dd, yyyy")}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {project.taskCount} tasks
                    </div>
                    <div>{project.completedTasks} completed</div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Edit Project Dialog */}
      <Dialog open={!!editingProject} onOpenChange={(open) => !open && setEditingProject(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>Update project information</DialogDescription>
          </DialogHeader>
          {editingProject && (
            <ProjectForm
              project={editingProject}
              mode="edit"
              onSuccess={() => setEditingProject(null)}
              onCancel={() => setEditingProject(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={!!deletingProject}
        onOpenChange={(open) => !open && setDeletingProject(null)}
        onConfirm={() => deletingProject && handleDeleteProject(deletingProject)}
        title="Delete Project"
        description={`Are you sure you want to delete "${deletingProject?.name}"? This action cannot be undone and will remove all associated tasks and data.`}
      />
    </div>
  )
}
