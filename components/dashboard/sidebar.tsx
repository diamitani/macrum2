"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  LayoutDashboard,
  Building2,
  FolderKanban,
  CheckSquare,
  Calendar,
  FileText,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/components/auth/auth-provider"

const navigation = [
  {
    name: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
    current: false,
  },
  {
    name: "Businesses",
    href: "/dashboard/businesses",
    icon: Building2,
    current: false,
  },
  {
    name: "Projects",
    href: "/dashboard/projects",
    icon: FolderKanban,
    current: false,
  },
  {
    name: "Tasks",
    href: "/dashboard/tasks",
    icon: CheckSquare,
    current: false,
  },
  {
    name: "Clients",
    href: "/dashboard/clients",
    icon: Users,
    current: false,
  },
  {
    name: "Calendar",
    href: "/dashboard/calendar",
    icon: Calendar,
    current: false,
  },
  {
    name: "Files",
    href: "/dashboard/files",
    icon: FileText,
    current: false,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { signOut } = useAuth()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div
      className={cn(
        "bg-white border-r border-gray-200 flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Macrum</span>
            <Badge variant="secondary" className="text-xs">
              CRM
            </Badge>
          </div>
        )}
        <Button variant="ghost" size="sm" onClick={() => setCollapsed(!collapsed)} className="p-1.5">
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
                collapsed && "justify-center",
              )}
            >
              <item.icon className={cn("w-5 h-5", !collapsed && "mr-3")} />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <Link
          href="/dashboard/settings"
          className={cn(
            "flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:text-gray-900 hover:bg-gray-50 transition-colors",
            collapsed && "justify-center",
          )}
        >
          <Settings className={cn("w-5 h-5", !collapsed && "mr-3")} />
          {!collapsed && <span>Settings</span>}
        </Link>
        <Button
          variant="ghost"
          onClick={signOut}
          className={cn("w-full justify-start text-gray-600 hover:text-gray-900", collapsed && "justify-center px-3")}
        >
          <LogOut className={cn("w-5 h-5", !collapsed && "mr-3")} />
          {!collapsed && <span>Sign Out</span>}
        </Button>
      </div>
    </div>
  )
}
