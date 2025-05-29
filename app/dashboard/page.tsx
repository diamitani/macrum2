"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Plus, Building2, FolderOpen, Users, FileText, TrendingUp, Clock, DollarSign } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"

// Create a separate component that handles business context safely
function BusinessStats() {
  // Mock data for now - this will be replaced with real context data later
  const portfolioStats = {
    totalBusinesses: 3,
    activeProjects: 12,
    pendingTasks: 28,
    totalRevenue: 145000,
    monthlyGrowth: 12.5,
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Businesses</p>
              <p className="text-2xl font-bold text-gray-900">{portfolioStats.totalBusinesses}</p>
            </div>
            <Building2 className="w-8 h-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Projects</p>
              <p className="text-2xl font-bold text-gray-900">{portfolioStats.activeProjects}</p>
            </div>
            <FolderOpen className="w-8 h-8 text-purple-600" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{portfolioStats.pendingTasks}</p>
            </div>
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${portfolioStats.totalRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Growth</p>
              <p className="text-2xl font-bold text-gray-900">+{portfolioStats.monthlyGrowth}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-emerald-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function BusinessOverview() {
  const businessOverview = [
    {
      id: 1,
      name: "Sales Agency",
      type: "Agency",
      projects: 5,
      revenue: 85000,
      status: "active",
      color: "blue",
      recentProjects: ["Client A - Proposal", "Client B - Contract", "Lead Campaign"],
    },
    {
      id: 2,
      name: "AI Consultancy",
      type: "Technology",
      projects: 4,
      revenue: 45000,
      status: "active",
      color: "purple",
      recentProjects: ["GPT Integration", "ML Model Training", "Client Onboarding"],
    },
    {
      id: 3,
      name: "Personal Projects",
      type: "Personal",
      projects: 3,
      revenue: 15000,
      status: "active",
      color: "green",
      recentProjects: ["Investment Research", "Property Management", "Side Business"],
    },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {businessOverview.map((business) => (
        <Card key={business.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{business.name}</CardTitle>
              <Badge variant="secondary">{business.type}</Badge>
            </div>
            <CardDescription>
              {business.projects} active projects • ${business.revenue.toLocaleString()} revenue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Status</span>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  {business.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 mb-2">Recent Projects:</p>
                <div className="space-y-1">
                  {business.recentProjects.slice(0, 3).map((project, index) => (
                    <div key={index} className="text-xs text-gray-600 flex items-center">
                      <div className={`w-2 h-2 rounded-full bg-${business.color}-500 mr-2`}></div>
                      {project}
                    </div>
                  ))}
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function DashboardContent() {
  const { user, signOut } = useAuth()
  const [activeView, setActiveView] = useState("overview")

  const recentActivity = [
    { id: 1, type: "project", business: "Sales Agency", action: "New lead added", time: "2 hours ago" },
    { id: 2, type: "task", business: "AI Consultancy", action: "Model training completed", time: "4 hours ago" },
    { id: 3, type: "contact", business: "Personal", action: "Meeting scheduled", time: "6 hours ago" },
    { id: 4, type: "project", business: "Sales Agency", action: "Proposal sent", time: "1 day ago" },
  ]

  const businessOverview = [
    {
      id: 1,
      name: "Sales Agency",
      type: "Agency",
      projects: 5,
      revenue: 85000,
      status: "active",
      color: "blue",
      recentProjects: ["Client A - Proposal", "Client B - Contract", "Lead Campaign"],
    },
    {
      id: 2,
      name: "AI Consultancy",
      type: "Technology",
      projects: 4,
      revenue: 45000,
      status: "active",
      color: "purple",
      recentProjects: ["GPT Integration", "ML Model Training", "Client Onboarding"],
    },
    {
      id: 3,
      name: "Personal Projects",
      type: "Personal",
      projects: 3,
      revenue: 15000,
      status: "active",
      color: "green",
      recentProjects: ["Investment Research", "Property Management", "Side Business"],
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Macrum</span>
              <Badge variant="secondary">Portfolio Manager</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name || "User"} />
                <AvatarFallback>{user?.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900">{user?.name || "User"}</p>
                <p className="text-xs text-gray-500">{user?.email || "user@example.com"}</p>
              </div>
              <Button variant="outline" onClick={signOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.name || "User"}!</h1>
          <p className="text-gray-600">Here's your business portfolio overview and recent activity.</p>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs value={activeView} onValueChange={setActiveView} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Portfolio Overview</TabsTrigger>
            <TabsTrigger value="businesses">Businesses</TabsTrigger>
            <TabsTrigger value="projects">All Projects</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <BusinessStats />
            <BusinessOverview />

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks across your business portfolio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button className="h-20 flex-col space-y-2">
                    <Plus className="w-6 h-6" />
                    <span>New Project</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col space-y-2">
                    <Building2 className="w-6 h-6" />
                    <span>Add Business</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col space-y-2">
                    <Users className="w-6 h-6" />
                    <span>Add Contact</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col space-y-2">
                    <FileText className="w-6 h-6" />
                    <span>Generate Report</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="businesses" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Your Businesses</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Business
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {businessOverview.map((business) => (
                <Card key={business.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {business.name}
                      <Badge variant="secondary">{business.type}</Badge>
                    </CardTitle>
                    <CardDescription>Manage projects, contacts, and assets for {business.name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold text-blue-600">{business.projects}</p>
                          <p className="text-xs text-gray-600">Projects</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-green-600">${(business.revenue / 1000).toFixed(0)}k</p>
                          <p className="text-xs text-gray-600">Revenue</p>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full">
                        Manage Business
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">All Projects</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {businessOverview.map((business) => (
                <Card key={business.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{business.name} Projects</CardTitle>
                    <CardDescription>{business.projects} active projects</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {business.recentProjects.map((project, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full bg-${business.color}-500`}></div>
                            <span className="font-medium">{project}</span>
                          </div>
                          <Badge variant="outline">Active</Badge>
                        </div>
                      ))}
                      <Button variant="ghost" className="w-full">
                        View All Projects
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        {activity.type === "project" && <FolderOpen className="w-5 h-5 text-blue-600" />}
                        {activity.type === "task" && <CheckCircle className="w-5 h-5 text-green-600" />}
                        {activity.type === "contact" && <Users className="w-5 h-5 text-purple-600" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{activity.action}</p>
                        <p className="text-sm text-gray-600">
                          {activity.business} • {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export default function DashboardPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/signin")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <DashboardContent />
}
