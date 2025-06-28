
"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { Sidebar } from "@/components/sidebar"

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check authentication status
    const authStatus = localStorage.getItem("macrum_auth")
    setIsAuthenticated(authStatus === "true")
    setIsLoading(false)
  }, [])

  // Show loading state during hydration
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Marketing pages and auth pages don't need sidebar
  const isMarketingPage = pathname?.startsWith('/marketing') || pathname?.startsWith('/auth')
  
  // If it's a marketing/auth page or user is not authenticated, show without sidebar
  if (isMarketingPage || !isAuthenticated) {
    return <>{children}</>
  }

  // Show dashboard layout with sidebar
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
    </div>
  )
}
