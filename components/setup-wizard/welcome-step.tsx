"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Briefcase, Building2, Users, Zap } from "lucide-react"

interface WelcomeStepProps {
  onNext: () => void
  onSkip: () => void
}

export function WelcomeStep({ onNext, onSkip }: WelcomeStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Welcome to your project management command center!</h3>
        <p className="text-gray-600 mb-8">
          Whether you're a freelancer, agency owner, or managing multiple businesses, we'll help you set up Macrum to
          match your workflow perfectly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center space-x-3 mb-3">
            <Briefcase className="w-6 h-6 text-blue-600" />
            <h4 className="font-semibold text-blue-900">For Freelancers</h4>
          </div>
          <p className="text-sm text-blue-700">
            Manage multiple clients, track project deadlines, and organize your contracts in one place.
          </p>
        </div>

        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center space-x-3 mb-3">
            <Building2 className="w-6 h-6 text-purple-600" />
            <h4 className="font-semibold text-purple-900">For Agencies</h4>
          </div>
          <p className="text-sm text-purple-700">
            Coordinate team projects, manage client relationships, and track business performance.
          </p>
        </div>

        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center space-x-3 mb-3">
            <Users className="w-6 h-6 text-green-600" />
            <h4 className="font-semibold text-green-900">For Consultants</h4>
          </div>
          <p className="text-sm text-green-700">
            Track consulting engagements, manage deliverables, and maintain client communications.
          </p>
        </div>

        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
          <div className="flex items-center space-x-3 mb-3">
            <Zap className="w-6 h-6 text-orange-600" />
            <h4 className="font-semibold text-orange-900">Multi-Business</h4>
          </div>
          <p className="text-sm text-orange-700">
            Manage multiple ventures, track cross-business opportunities, and maintain oversight.
          </p>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="ghost" onClick={onSkip}>
          Skip Setup
        </Button>
        <Button onClick={onNext} className="bg-gradient-to-r from-blue-600 to-purple-600">
          Let's Get Started
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
