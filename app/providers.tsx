"use client"

import type { ReactNode } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { BusinessProvider } from "@/context/business-context"
import { ProjectProvider } from "@/context/project-context"

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <BusinessProvider>
        <ProjectProvider>{children}</ProjectProvider>
      </BusinessProvider>
    </ThemeProvider>
  )
}
