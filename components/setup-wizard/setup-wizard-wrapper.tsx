"use client"

import type React from "react"

import { useAuth } from "@/components/auth/auth-provider"
import { SetupWizard } from "./setup-wizard"

interface SetupWizardWrapperProps {
  children: React.ReactNode
}

export function SetupWizardWrapper({ children }: SetupWizardWrapperProps) {
  const { showSetupWizard, completeSetup, skipSetup } = useAuth()

  if (showSetupWizard) {
    return <SetupWizard onComplete={completeSetup} onSkip={skipSetup} />
  }

  return <>{children}</>
}
