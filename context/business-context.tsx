"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { v4 as uuidv4 } from "uuid"
import { toast } from "@/components/ui/use-toast"

export interface Business {
  id: string
  name: string
  description: string
  industry?: string
  website?: string
  email?: string
  phone?: string
  address?: string
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
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined)

export function BusinessProvider({ children }: { children: ReactNode }) {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load businesses from localStorage on mount
  useEffect(() => {
    const loadBusinesses = () => {
      try {
        const savedBusinesses = localStorage.getItem("businesses")
        if (savedBusinesses) {
          setBusinesses(JSON.parse(savedBusinesses))
        }
      } catch (error) {
        console.error("Failed to load businesses from localStorage:", error)
        toast({
          title: "Error",
          description: "Failed to load business data. Please refresh the page.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadBusinesses()
  }, [])

  // Save businesses to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("businesses", JSON.stringify(businesses))
    }
  }, [businesses, isLoading])

  const getBusiness = (id: string) => {
    return businesses.find((business) => business.id === id)
  }

  const addBusiness = (
    businessData: Omit<Business, "id" | "createdAt" | "updatedAt" | "projectCount" | "activeProjects">,
  ) => {
    const now = new Date().toISOString()
    const newBusiness: Business = {
      id: uuidv4(),
      ...businessData,
      createdAt: now,
      updatedAt: now,
      projectCount: 0,
      activeProjects: 0,
    }

    setBusinesses((prev) => [...prev, newBusiness])
    return newBusiness
  }

  const updateBusiness = (id: string, businessData: Partial<Business>) => {
    let updatedBusiness: Business | undefined

    setBusinesses((prev) => {
      const updatedBusinesses = prev.map((business) => {
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
      return updatedBusinesses
    })

    return updatedBusiness
  }

  const deleteBusiness = (id: string) => {
    const businessExists = businesses.some((business) => business.id === id)

    if (businessExists) {
      setBusinesses((prev) => prev.filter((business) => business.id !== id))
      return true
    }

    return false
  }

  const incrementProjectCount = (businessId: string, active = true) => {
    setBusinesses((prev) =>
      prev.map((business) => {
        if (business.id === businessId) {
          return {
            ...business,
            projectCount: business.projectCount + 1,
            activeProjects: active ? business.activeProjects + 1 : business.activeProjects,
            updatedAt: new Date().toISOString(),
          }
        }
        return business
      }),
    )
  }

  const decrementProjectCount = (businessId: string, active = true) => {
    setBusinesses((prev) =>
      prev.map((business) => {
        if (business.id === businessId) {
          return {
            ...business,
            projectCount: Math.max(0, business.projectCount - 1),
            activeProjects: active ? Math.max(0, business.activeProjects - 1) : business.activeProjects,
            updatedAt: new Date().toISOString(),
          }
        }
        return business
      }),
    )
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
