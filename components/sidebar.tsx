"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Building2,
  FolderOpen,
  Users,
  Calendar,
  FileText,
  Settings,
  CheckSquare,
  Handshake,
  Network,
  Home,
  BookOpen,
  LogOut,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"

interface NavigationItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const navigation: NavigationItem[] = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Businesses", href: "/businesses", icon: Building2 },
  { name: "Projects", href: "/projects", icon: FolderOpen },
  { name: "Tasks", href: "/tasks", icon: CheckSquare },
  { name: "Deals", href: "/deals", icon: Handshake },
  { name: "Twenty", href: "/twenty", icon: Network },
  { name: "Notebook", href: "/notebook", icon: BookOpen },
  { name: "Clients", href: "/clients", icon: Users },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Files", href: "/files", icon: FileText },
  { name: "Settings", href: "/settings", icon: Settings },
]

interface SidebarProps {
  /** Desktop icon-only mode. Ignored styling is full-width. */
  collapsed?: boolean
  /** Called when the collapse toggle is pressed (desktop). */
  onToggleCollapse?: () => void
  /** Called when a nav link is pressed (used to close the mobile drawer). */
  onNavigate?: () => void
}

export function Sidebar({ collapsed = false, onToggleCollapse, onNavigate }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = () => {
    try {
      localStorage.removeItem("macrum_auth")
      localStorage.removeItem("macrum_user")
    } catch {
      // storage unavailable — still redirect
    }
    router.push("/auth/signin")
  }

  return (
    <div
      className={cn(
        "flex h-full flex-col bg-gray-50 transition-[width] duration-200 dark:bg-gray-900",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className={cn("flex h-16 items-center", collapsed ? "justify-center px-2" : "px-4")}>
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 font-bold text-white">
            M
          </div>
          {!collapsed && <span className="text-xl font-bold">Macrum</span>}
        </div>
        {!collapsed && onToggleCollapse && (
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto h-8 w-8"
            onClick={onToggleCollapse}
            aria-label="Collapse sidebar"
            title="Collapse sidebar"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
        )}
      </div>
      {collapsed && onToggleCollapse && (
        <div className="flex justify-center pb-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onToggleCollapse}
            aria-label="Expand sidebar"
            title="Expand sidebar"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      )}
      <ScrollArea className="flex-1 px-3">
        <nav className="space-y-1 py-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.name} href={item.href} onClick={onNavigate} title={collapsed ? item.name : undefined}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full",
                    collapsed ? "justify-center px-0" : "justify-start",
                    isActive && "bg-gray-100 dark:bg-gray-800",
                  )}
                >
                  <item.icon className={cn("h-4 w-4", !collapsed && "mr-2")} />
                  {!collapsed && item.name}
                </Button>
              </Link>
            )
          })}
        </nav>
      </ScrollArea>
      <div className={cn("mt-auto space-y-3 border-t", collapsed ? "p-2" : "p-4")}>
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarImage src="/placeholder-user.jpg" alt="User" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">John Doe</p>
              <p className="truncate text-xs text-muted-foreground">john@example.com</p>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          className={cn(
            "w-full text-red-600 hover:bg-red-50 hover:text-red-700",
            collapsed ? "justify-center px-0" : "justify-start",
          )}
          onClick={handleSignOut}
          title={collapsed ? "Sign Out" : undefined}
          aria-label="Sign Out"
        >
          <LogOut className={cn("h-4 w-4", !collapsed && "mr-2")} />
          {!collapsed && "Sign Out"}
        </Button>
      </div>
    </div>
  )
}
