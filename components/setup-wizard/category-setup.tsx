"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, ArrowLeft, Plus, X } from "lucide-react"
import type { SetupData } from "./setup-wizard"

interface CategorySetupProps {
  data: SetupData
  onComplete: (data: Partial<SetupData>) => void
  onPrevious: () => void
  onSkip: () => void
  canGoBack: boolean
}

export function CategorySetup({ data, onComplete, onPrevious, onSkip, canGoBack }: CategorySetupProps) {
  const [categories, setCategories] = useState<string[]>(data.categories)
  const [newCategory, setNewCategory] = useState("")

  const suggestedCategories = [
    "Web Development",
    "Mobile App Development",
    "UI/UX Design",
    "Graphic Design",
    "Content Writing",
    "SEO & Marketing",
    "Consulting",
    "Photography",
    "Video Production",
    "E-commerce",
    "Branding",
    "Social Media",
  ]

  const addCategory = (category: string) => {
    if (category && !categories.includes(category)) {
      setCategories([...categories, category])
    }
    setNewCategory("")
  }

  const removeCategory = (category: string) => {
    setCategories(categories.filter((c) => c !== category))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onComplete({ categories })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Project Categories</h3>
        <p className="text-gray-600 mb-4">
          Define categories to organize your projects. You can always add more later.
        </p>
      </div>

      {/* Add Custom Category */}
      <div>
        <Label htmlFor="newCategory">Add Custom Category</Label>
        <div className="flex space-x-2 mt-1">
          <Input
            id="newCategory"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Enter category name"
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCategory(newCategory))}
          />
          <Button type="button" variant="outline" onClick={() => addCategory(newCategory)} disabled={!newCategory}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Suggested Categories */}
      <div>
        <Label>Suggested Categories</Label>
        <p className="text-sm text-gray-600 mb-3">Click to add popular project categories</p>
        <div className="flex flex-wrap gap-2">
          {suggestedCategories.map((category) => (
            <Button
              key={category}
              type="button"
              variant={categories.includes(category) ? "default" : "outline"}
              size="sm"
              onClick={() => (categories.includes(category) ? removeCategory(category) : addCategory(category))}
            >
              {category}
              {categories.includes(category) && <X className="w-3 h-3 ml-1" />}
            </Button>
          ))}
        </div>
      </div>

      {/* Selected Categories */}
      {categories.length > 0 && (
        <div>
          <Label>Your Categories ({categories.length})</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {categories.map((category) => (
              <Badge key={category} variant="secondary" className="text-sm">
                {category}
                <button type="button" onClick={() => removeCategory(category)} className="ml-2 hover:text-red-600">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

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
