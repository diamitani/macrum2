"use client"

import type React from "react"

import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "next-themes"
import { BusinessProvider } from "@/context/business-context"
import { ClientProvider } from "@/context/client-context"
import { ProjectProvider } from "@/context/project-context"
import { TaskProvider } from "@/context/task-context"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TaskProvider>
          <BusinessProvider>
            <ClientProvider>
              <ProjectProvider>{children}</ProjectProvider>
            </ClientProvider>
          </BusinessProvider>
        </TaskProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}
