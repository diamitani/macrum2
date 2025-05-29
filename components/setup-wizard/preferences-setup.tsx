"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, ArrowLeft, Moon, Sun, Bell, Clock } from "lucide-react"
import type { SetupData } from "./setup-wizard"

interface PreferencesSetupProps {
  data: SetupData
  onComplete: (data: Partial<SetupData>) => void
  onPrevious: () => void
  onSkip: () => void
  canGoBack: boolean
}

export function PreferencesSetup({ data, onComplete, onPrevious, onSkip, canGoBack }: PreferencesSetupProps) {
  const [preferences, setPreferences] = useState(data.preferences)

  const timezones = [
    "UTC",
    "America/New_York",
    "America/Chicago",
    "America/Denver",
    "America/Los_Angeles",
    "Europe/London",
    "Europe/Paris",
    "Asia/Tokyo",
    "Asia/Shanghai",
    "Australia/Sydney",
  ]

  const defaultViews = [
    { value: "dashboard", label: "Dashboard Overview" },
    { value: "projects", label: "Projects List" },
    { value: "calendar", label: "Calendar View" },
    { value: "tasks", label: "Tasks List" },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onComplete({ preferences })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Customize Your Experience</h3>
        <p className="text-gray-600 mb-4">Set up your preferences to make Macrum work the way you do.</p>
      </div>

      {/* Theme Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sun className="w-5 h-5" />
            <span>Appearance</span>
          </CardTitle>
          <CardDescription>Choose your preferred theme</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setPreferences({ ...preferences, theme: "light" })}
              className={`p-4 rounded-lg border-2 transition-colors ${
                preferences.theme === "light" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <Sun className="w-6 h-6 mx-auto mb-2" />
              <div className="text-sm font-medium">Light</div>
            </button>
            <button
              type="button"
              onClick={() => setPreferences({ ...preferences, theme: "dark" })}
              className={`p-4 rounded-lg border-2 transition-colors ${
                preferences.theme === "dark" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <Moon className="w-6 h-6 mx-auto mb-2" />
              <div className="text-sm font-medium">Dark</div>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>Notifications</span>
          </CardTitle>
          <CardDescription>Choose what notifications you'd like to receive</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <p className="text-sm text-gray-600">Receive updates via email</p>
            </div>
            <Switch
              id="email-notifications"
              checked={preferences.notifications.email}
              onCheckedChange={(checked) =>
                setPreferences({
                  ...preferences,
                  notifications: { ...preferences.notifications, email: checked },
                })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="push-notifications">Push Notifications</Label>
              <p className="text-sm text-gray-600">Browser notifications</p>
            </div>
            <Switch
              id="push-notifications"
              checked={preferences.notifications.push}
              onCheckedChange={(checked) =>
                setPreferences({
                  ...preferences,
                  notifications: { ...preferences.notifications, push: checked },
                })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="deadline-notifications">Deadline Reminders</Label>
              <p className="text-sm text-gray-600">Get notified about upcoming deadlines</p>
            </div>
            <Switch
              id="deadline-notifications"
              checked={preferences.notifications.deadlines}
              onCheckedChange={(checked) =>
                setPreferences({
                  ...preferences,
                  notifications: { ...preferences.notifications, deadlines: checked },
                })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="update-notifications">Project Updates</Label>
              <p className="text-sm text-gray-600">Notifications for project changes</p>
            </div>
            <Switch
              id="update-notifications"
              checked={preferences.notifications.updates}
              onCheckedChange={(checked) =>
                setPreferences({
                  ...preferences,
                  notifications: { ...preferences.notifications, updates: checked },
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Working Hours & Default View */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Working Hours</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="start-time">Start Time</Label>
              <Select
                value={preferences.workingHours.start}
                onValueChange={(value) =>
                  setPreferences({
                    ...preferences,
                    workingHours: { ...preferences.workingHours, start: value },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }, (_, i) => {
                    const hour = i.toString().padStart(2, "0")
                    return (
                      <SelectItem key={hour} value={`${hour}:00`}>
                        {hour}:00
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="end-time">End Time</Label>
              <Select
                value={preferences.workingHours.end}
                onValueChange={(value) =>
                  setPreferences({
                    ...preferences,
                    workingHours: { ...preferences.workingHours, end: value },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }, (_, i) => {
                    const hour = i.toString().padStart(2, "0")
                    return (
                      <SelectItem key={hour} value={`${hour}:00`}>
                        {hour}:00
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="timezone">Timezone</Label>
              <Select
                value={preferences.workingHours.timezone}
                onValueChange={(value) =>
                  setPreferences({
                    ...preferences,
                    workingHours: { ...preferences.workingHours, timezone: value },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map((tz) => (
                    <SelectItem key={tz} value={tz}>
                      {tz}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Default View</CardTitle>
            <CardDescription>Choose your preferred landing page</CardDescription>
          </CardHeader>
          <CardContent>
            <Select
              value={preferences.defaultView}
              onValueChange={(value) => setPreferences({ ...preferences, defaultView: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {defaultViews.map((view) => (
                  <SelectItem key={view.value} value={view.value}>
                    {view.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
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
        <Button type="submit">
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </form>
  )
}
