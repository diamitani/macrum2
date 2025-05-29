"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ProjectList } from "@/components/project-list"
import { useProjects } from "@/context/project-context"
import { useBusinesses } from "@/context/business-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBusiness, setSelectedBusiness] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedPriority, setSelectedPriority] = useState<string>("all")

  const { projects, isLoading } = useProjects()
  const { businesses } = useBusinesses()

  // Filter projects based on search and filters
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.businessName.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesBusiness = selectedBusiness === "all" || project.businessId === selectedBusiness
    const matchesStatus = selectedStatus === "all" || project.status === selectedStatus
    const matchesPriority = selectedPriority === "all" || project.priority === selectedPriority

    return matchesSearch && matchesBusiness && matchesStatus && matchesPriority
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Manage all your projects across different businesses ({projects.length} total)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/projects/new">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search projects..."
            className="w-full pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedBusiness} onValueChange={setSelectedBusiness}>
            <SelectTrigger className="w-[150px]">
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

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="planning">Planning</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="in-review">In Review</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

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
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Projects ({filteredProjects.length})</TabsTrigger>
          <TabsTrigger value="active">
            Active ({filteredProjects.filter((p) => p.status !== "completed").length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({filteredProjects.filter((p) => p.status === "completed").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <ProjectListWithFilter projects={filteredProjects} />
        </TabsContent>

        <TabsContent value="active" className="mt-6">
          <ProjectListWithFilter projects={filteredProjects.filter((p) => p.status !== "completed")} />
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <ProjectListWithFilter projects={filteredProjects.filter((p) => p.status === "completed")} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ProjectListWithFilter({ projects }: { projects: any[] }) {
  if (projects.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 border rounded-lg">
        <div className="text-center">
          <h3 className="mt-4 text-lg font-medium">No projects found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Create a new project or adjust your filters to see more results
          </p>
          <Link href="/projects/new">
            <Button className="mt-4">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Project
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return <ProjectList />
}
