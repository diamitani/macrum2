"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/sidebar"

const COLLAPSED_KEY = "macrum_sidebar_collapsed"

/**
 * Authenticated app shell:
 * - Desktop (md+): fixed sidebar, collapsible to icon-only (state persisted).
 * - Mobile: sticky top bar with hamburger; sidebar opens as a slide-over drawer.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(COLLAPSED_KEY) === "true")
    } catch {
      // storage unavailable — default to expanded
    }
  }, [])

  // Close the mobile drawer on every navigation.
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev
      try {
        localStorage.setItem(COLLAPSED_KEY, String(next))
      } catch {
        // ignore persistence failures
      }
      return next
    })
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden md:flex-row">
      {/* Mobile top bar */}
      <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background px-3 md:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-bold text-white">
            M
          </div>
          <span className="text-lg font-bold">Macrum</span>
        </div>
      </header>

      {/* Desktop sidebar */}
      <div className="hidden shrink-0 md:flex">
        <Sidebar collapsed={collapsed} onToggleCollapse={toggleCollapsed} />
      </div>

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity md:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] transition-transform duration-200 md:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
        aria-label="Mobile navigation"
      >
        <div className="relative h-full">
          <Sidebar onNavigate={() => setMobileOpen(false)} />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-4 h-8 w-8"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation menu"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
    </div>
  )
}
