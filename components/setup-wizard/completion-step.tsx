"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle, Rocket, ArrowRight } from "lucide-react"

interface CompletionStepProps {
  onNext: () => void
}

export function CompletionStep({ onNext }: CompletionStepProps) {
  return (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">You're All Set!</h3>
        <p className="text-lg text-gray-600 mb-6">
          Your Macrum workspace is ready to help you manage projects like a pro.
        </p>
      </div>

      <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-3">What's Next?</h4>
        <ul className="text-left space-y-2 text-blue-800">
          <li className="flex items-center">
            <CheckCircle className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0" />
            Create your first business or client workspace
          </li>
          <li className="flex items-center">
            <CheckCircle className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0" />
            Add your first project and set up tasks
          </li>
          <li className="flex items-center">
            <CheckCircle className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0" />
            Explore the calendar and file management features
          </li>
          <li className="flex items-center">
            <CheckCircle className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0" />
            Invite team members or clients to collaborate
          </li>
        </ul>
      </div>

      <Button onClick={onNext} size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600">
        <Rocket className="w-5 h-5 mr-2" />
        Launch Dashboard
        <ArrowRight className="w-5 h-5 ml-2" />
      </Button>
    </div>
  )
}
