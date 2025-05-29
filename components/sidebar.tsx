"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  BarChart3,
  Building2,
  Calendar,
  CheckSquare,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
} from "lucide-react"

export function Sidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`)
  }

  const navigation = [
    {
      name: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
      current: isActive("/") && pathname === "/",
    },
    {
      name: "Businesses",
      href: "/businesses",
      icon: Building2,
      current: isActive("/businesses"),
    },
    {
      name: "Projects",
      href: "/projects",
      icon: FolderKanban,
      current: isActive("/projects"),
    },
    {
      name: "Tasks",
      href: "/tasks",
      icon: CheckSquare,
      current: isActive("/tasks"),
    },
    {
      name: "Clients",
      href: "/clients",
      icon: Users,
      current: isActive("/clients"),
    },
    {
      name: "Calendar",
      href: "/calendar",
      icon: Calendar,
      current: isActive("/calendar"),
    },
    {
      name: "Contacts",
      href: "/contacts",
      icon: Users,
      current: isActive("/contacts"),
    },
    {
      name: "Reports",
      href: "/reports",
      icon: BarChart3,
      current: isActive("/reports"),
    },
  ]

  return (
    <div className="flex h-full flex-col border-r bg-background">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">M</span>
          </div>
          <span className="font-bold text-xl">Macrum</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                item.current ? "bg-muted text-primary" : "text-muted-foreground hover:bg-transparent"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-auto p-4">
        <nav className="grid items-start gap-2 text-sm font-medium">
          <Link
            href="/settings"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
              isActive("/settings") ? "bg-muted text-primary" : "text-muted-foreground hover:bg-transparent"
            }`}
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
          <Button variant="outline" className="justify-start" asChild>
            <Link href="/sign-out">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Link>
          </Button>
        </nav>
      </div>
    </div>
  )
}
