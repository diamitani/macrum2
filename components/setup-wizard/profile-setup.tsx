"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, ArrowLeft } from "lucide-react"
import type { SetupData } from "./setup-wizard"

interface ProfileSetupProps {
  data: SetupData
  onComplete: (data: Partial<SetupData>) => void
  onPrevious: () => void
  onSkip: () => void
  canGoBack: boolean
}

export function ProfileSetup({ data, onComplete, onPrevious, onSkip, canGoBack }: ProfileSetupProps) {
  const [profile, setProfile] = useState(data.profile)

  const industries = [
    "Technology",
    "Design & Creative",
    "Marketing & Advertising",
    "Consulting",
    "Finance",
    "Healthcare",
    "Education",
    "E-commerce",
    "Real Estate",
    "Other",
  ]

  const experienceLevels = ["Just starting out", "1-2 years", "3-5 years", "5-10 years", "10+ years"]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onComplete({ profile })
  }

  const isValid = profile.firstName && profile.lastName && profile.jobTitle

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={profile.firstName}
            onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
            placeholder="John"
            required
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={profile.lastName}
            onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
            placeholder="Doe"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="jobTitle">Job Title / Role *</Label>
        <Input
          id="jobTitle"
          value={profile.jobTitle}
          onChange={(e) => setProfile({ ...profile, jobTitle: e.target.value })}
          placeholder="e.g., Freelance Designer, Project Manager, CEO"
          required
        />
      </div>

      <div>
        <Label htmlFor="company">Company / Business Name</Label>
        <Input
          id="company"
          value={profile.company}
          onChange={(e) => setProfile({ ...profile, company: e.target.value })}
          placeholder="Your company or freelance business name"
        />
      </div>

      <div>
        <Label htmlFor="industry">Industry</Label>
        <Select value={profile.industry} onValueChange={(value) => setProfile({ ...profile, industry: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select your industry" />
          </SelectTrigger>
          <SelectContent>
            {industries.map((industry) => (
              <SelectItem key={industry} value={industry}>
                {industry}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="experience">Experience Level</Label>
        <Select value={profile.experience} onValueChange={(value) => setProfile({ ...profile, experience: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select your experience level" />
          </SelectTrigger>
          <SelectContent>
            {experienceLevels.map((level) => (
              <SelectItem key={level} value={level}>
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-between pt-6">
        <div className="flex space-x-2">
          {canGoBack && (
            <Button type="button" variant="outline" onClick={onPrevious}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
          <Button type="button" variant="ghost" onClick={onSkip}>
            Skip
          </Button>
        </div>
        <Button type="submit" disabled={!isValid}>
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </form>
  )
}
