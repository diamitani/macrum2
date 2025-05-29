"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle } from "lucide-react"
import { ProfileSetup } from "./profile-setup"
import { CategorySetup } from "./category-setup"
import { PreferencesSetup } from "./preferences-setup"
import { WelcomeStep } from "./welcome-step"
import { CompletionStep } from "./completion-step"

export interface SetupData {
  profile: {
    firstName: string
    lastName: string
    jobTitle: string
    company: string
    industry: string
    experience: string
  }
  categories: string[]
  preferences: {
    theme: string
    notifications: {
      email: boolean
      push: boolean
      deadlines: boolean
      updates: boolean
    }
    workingHours: {
      start: string
      end: string
      timezone: string
    }
    defaultView: string
  }
}

const initialData: SetupData = {
  profile: {
    firstName: "",
    lastName: "",
    jobTitle: "",
    company: "",
    industry: "",
    experience: "",
  },
  categories: [],
  preferences: {
    theme: "light",
    notifications: {
      email: true,
      push: true,
      deadlines: true,
      updates: false,
    },
    workingHours: {
      start: "09:00",
      end: "17:00",
      timezone: "UTC",
    },
    defaultView: "dashboard",
  },
}

interface SetupWizardProps {
  onComplete: (data: SetupData) => void
  onSkip: () => void
}

export function SetupWizard({ onComplete, onSkip }: SetupWizardProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [setupData, setSetupData] = useState<SetupData>(initialData)

  const steps = [
    {
      id: "welcome",
      title: "Welcome to Macrum",
      description: "Let's get you set up for success",
      component: WelcomeStep,
    },
    {
      id: "profile",
      title: "Your Profile",
      description: "Tell us about yourself",
      component: ProfileSetup,
    },
    {
      id: "categories",
      title: "Project Categories",
      description: "Define your project types",
      component: CategorySetup,
    },
    {
      id: "preferences",
      title: "Preferences",
      description: "Customize your experience",
      component: PreferencesSetup,
    },
    {
      id: "completion",
      title: "All Set!",
      description: "You're ready to start managing projects",
      component: CompletionStep,
    },
  ]

  const currentStepData = steps[currentStep]
  const progress = ((currentStep + 1) / steps.length) * 100

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete(setupData)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleStepComplete = (stepData: any) => {
    setSetupData((prev) => ({
      ...prev,
      ...stepData,
    }))
    handleNext()
  }

  const StepComponent = currentStepData.component

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Macrum</span>
          </div>
          <CardTitle className="text-2xl">{currentStepData.title}</CardTitle>
          <CardDescription className="text-lg">{currentStepData.description}</CardDescription>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>
                Step {currentStep + 1} of {steps.length}
              </span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>

        <CardContent>
          <StepComponent
            data={setupData}
            onComplete={handleStepComplete}
            onNext={handleNext}
            onPrevious={handlePrevious}
            canGoBack={currentStep > 0}
            canSkip={currentStep !== 0 && currentStep !== steps.length - 1}
            onSkip={onSkip}
          />
        </CardContent>
      </Card>
    </div>
  )
}
