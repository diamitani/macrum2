"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { toast } from "@/components/ui/use-toast"

// Generate a simple ID function
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export interface Business {
  id: string
  name: string
  description: string
  industry: string
  website?: string
  email?: string
  phone?: string
  address?: string
  status: "active" | "inactive" | "planning"
  createdAt: string
  updatedAt: string
  projectCount: number
  activeProjects: number
}

interface BusinessContextType {
  businesses: Business[]
  isLoading: boolean
  getBusiness: (id: string) => Business | undefined
  addBusiness: (
    business: Omit<Business, "id" | "createdAt" | "updatedAt" | "projectCount" | "activeProjects">,
  ) => Business
  updateBusiness: (id: string, business: Partial<Business>) => Business | undefined
  deleteBusiness: (id: string) => boolean
  incrementProjectCount: (businessId: string, active?: boolean) => void
  decrementProjectCount: (businessId: string, active?: boolean) => void
  refreshBusinesses: () => void
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined)

export function BusinessProvider({ children }: { children: ReactNode }) {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load businesses from localStorage on mount
  useEffect(() => {
    const loadBusinesses = () => {
      try {
        const savedBusinesses = localStorage.getItem("macrum_businesses")
        if (savedBusinesses) {
          const parsedBusinesses = JSON.parse(savedBusinesses)
          // Validate and sanitize the data
          const validBusinesses = parsedBusinesses.filter(
            (business: any) => business && typeof business === "object" && business.id && business.name,
          )
          setBusinesses(validBusinesses)
        }
      } catch (error) {
        console.error("Failed to load businesses from localStorage:", error)
        localStorage.removeItem("macrum_businesses")
        toast({
          title: "Data Recovery",
          description: "Business data was corrupted and has been reset.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadBusinesses()
  }, [])

  // Save businesses to localStorage with error handling
  const saveBusinesses = (businessesToSave: Business[]) => {
    try {
      localStorage.setItem("macrum_businesses", JSON.stringify(businessesToSave))
    } catch (error) {
      console.error("Failed to save businesses to localStorage:", error)
      toast({
        title: "Save Error",
        description: "Failed to save business data. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Save businesses whenever they change
  useEffect(() => {
    if (!isLoading && businesses.length >= 0) {
      saveBusinesses(businesses)
    }
  }, [businesses, isLoading])

  const getBusiness = (id: string) => {
    return businesses.find((business) => business.id === id)
  }

  const addBusiness = (
    businessData: Omit<Business, "id" | "createdAt" | "updatedAt" | "projectCount" | "activeProjects">,
  ) => {
    try {
      const now = new Date().toISOString()
      const newBusiness: Business = {
        id: generateId(),
        ...businessData,
        createdAt: now,
        updatedAt: now,
        projectCount: 0,
        activeProjects: 0,
      }

      setBusinesses((prev) => {
        const updated = [...prev, newBusiness]
        saveBusinesses(updated)
        return updated
      })

      toast({
        title: "Success",
        description: `Business "${newBusiness.name}" has been created successfully.`,
      })

      return newBusiness
    } catch (error) {
      console.error("Failed to add business:", error)
      toast({
        title: "Error",
        description: "Failed to create business. Please try again.",
        variant: "destructive",
      })
      throw error
    }
  }

  const updateBusiness = (id: string, businessData: Partial<Business>) => {
    try {
      let updatedBusiness: Business | undefined

      setBusinesses((prev) => {
        const updated = prev.map((business) => {
          if (business.id === id) {
            updatedBusiness = {
              ...business,
              ...businessData,
              updatedAt: new Date().toISOString(),
            }
            return updatedBusiness
          }
          return business
        })
        saveBusinesses(updated)
        return updated
      })

      if (updatedBusiness) {
        toast({
          title: "Success",
          description: `Business "${updatedBusiness.name}" has been updated.`,
        })
      }

      return updatedBusiness
    } catch (error) {
      console.error("Failed to update business:", error)
      toast({
        title: "Error",
        description: "Failed to update business. Please try again.",
        variant: "destructive",
      })
      return undefined
    }
  }

  const deleteBusiness = (id: string) => {
    try {
      const business = getBusiness(id)
      if (!business) return false

      setBusinesses((prev) => {
        const updated = prev.filter((b) => b.id !== id)
        saveBusinesses(updated)
        return updated
      })

      toast({
        title: "Success",
        description: `Business "${business.name}" has been deleted.`,
      })

      return true
    } catch (error) {
      console.error("Failed to delete business:", error)
      toast({
        title: "Error",
        description: "Failed to delete business. Please try again.",
        variant: "destructive",
      })
      return false
    }
  }

  const incrementProjectCount = (businessId: string, active = true) => {
    setBusinesses((prev) => {
      const updated = prev.map((business) => {
        if (business.id === businessId) {
          return {
            ...business,
            projectCount: business.projectCount + 1,
            activeProjects: active ? business.activeProjects + 1 : business.activeProjects,
            updatedAt: new Date().toISOString(),
          }
        }
        return business
      })
      saveBusinesses(updated)
      return updated
    })
  }

  const decrementProjectCount = (businessId: string, active = true) => {
    setBusinesses((prev) => {
      const updated = prev.map((business) => {
        if (business.id === businessId) {
          return {
            ...business,
            projectCount: Math.max(0, business.projectCount - 1),
            activeProjects: active ? Math.max(0, business.activeProjects - 1) : business.activeProjects,
            updatedAt: new Date().toISOString(),
          }
        }
        return business
      })
      saveBusinesses(updated)
      return updated
    })
  }

  const refreshBusinesses = () => {
    setIsLoading(true)
    try {
      const savedBusinesses = localStorage.getItem("macrum_businesses")
      if (savedBusinesses) {
        const parsedBusinesses = JSON.parse(savedBusinesses)
        setBusinesses(parsedBusinesses)
      }
    } catch (error) {
      console.error("Failed to refresh businesses:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <BusinessContext.Provider
      value={{
        businesses,
        isLoading,
        getBusiness,
        addBusiness,
        updateBusiness,
        deleteBusiness,
        incrementProjectCount,
        decrementProjectCount,
        refreshBusinesses,
      }}
    >
      {children}
    </BusinessContext.Provider>
  )
}

export function useBusinesses() {
  const context = useContext(BusinessContext)
  if (context === undefined) {
    throw new Error("useBusinesses must be used within a BusinessProvider")
  }
  return context
}
