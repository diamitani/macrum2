"use client"

import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { BusinessProvider } from "@/context/business-context"
import { ProjectProvider } from "@/context/project-context"
import { ClientProvider } from "@/context/client-context" // Correctly imported
import { TaskProvider } from "@/context/task-context"
import { Toaster } from "@/components/ui/toaster"
// import { AuthProvider } from '@/components/auth/auth-provider';
// import { SetupWizardWrapper } from '@/components/setup-wizard/setup-wizard-wrapper';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {/* <AuthProvider> */}
      <BusinessProvider>
        <ProjectProvider>
          <ClientProvider>
            {" "}
            {/* Correctly used */}
            <TaskProvider>
              {/* <SetupWizardWrapper> */}
              {children}
              {/* </SetupWizardWrapper> */}
            </TaskProvider>
          </ClientProvider>
        </ProjectProvider>
      </BusinessProvider>
      <Toaster />
      {/* </AuthProvider> */}
    </ThemeProvider>
  )
}
