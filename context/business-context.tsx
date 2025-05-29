"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
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
  clientIds: string[] // Dependencies to clients
  status: "active" | "inactive" | "archived"
}

interface BusinessContextType {
  businesses: Business[]
  isLoading: boolean
  getBusiness: (id: string) => Business | undefined
  addBusiness: (
    business: Omit<Business, "id" | "createdAt" | "updatedAt" | "projectCount" | "activeProjects" | "clientIds">,
  ) => Business
  updateBusiness: (id: string, business: Partial<Business>) => Business | undefined
  deleteBusiness: (id: string) => boolean
  incrementProjectCount: (businessId: string, active?: boolean) => void
  decrementProjectCount: (businessId: string, active?: boolean) => void
  addClientToBusiness: (businessId: string, clientId: string) => void
  removeClientFromBusiness: (businessId: string, clientId: string) => void
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined)

// Simple ID generator function
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export function BusinessProvider({ children }: { children: ReactNode }) {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load businesses from localStorage on mount
  useEffect(() => {
    const loadBusinesses = () => {
      try {
        const savedBusinesses = localStorage.getItem("macrum_businesses")
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
      localStorage.setItem("macrum_businesses", JSON.stringify(businesses))
    }
  }, [businesses, isLoading])

  const getBusiness = (id: string) => {
    return businesses.find((business) => business.id === id)
  }

  const addBusiness = (
    businessData: Omit<Business, "id" | "createdAt" | "updatedAt" | "projectCount" | "activeProjects" | "clientIds">,
  ) => {
    const now = new Date().toISOString()
    const newBusiness: Business = {
      id: generateId(),
      ...businessData,
      createdAt: now,
      updatedAt: now,
      projectCount: 0,
      activeProjects: 0,
      clientIds: [],
      status: "active",
    }

    setBusinesses((prev) => [...prev, newBusiness])
    toast({
      title: "Success",
      description: "Business created successfully!",
    })
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

    if (updatedBusiness) {
      toast({
        title: "Success",
        description: "Business updated successfully!",
      })
    }

    return updatedBusiness
  }

  const deleteBusiness = (id: string) => {
    const businessExists = businesses.some((business) => business.id === id)

    if (businessExists) {
      setBusinesses((prev) => prev.filter((business) => business.id !== id))
      toast({
        title: "Success",
        description: "Business deleted successfully!",
      })
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

  const addClientToBusiness = (businessId: string, clientId: string) => {
    setBusinesses((prev) =>
      prev.map((business) => {
        if (business.id === businessId && !business.clientIds.includes(clientId)) {
          return {
            ...business,
            clientIds: [...business.clientIds, clientId],
            updatedAt: new Date().toISOString(),
          }
        }
        return business
      }),
    )
  }

  const removeClientFromBusiness = (businessId: string, clientId: string) => {
    setBusinesses((prev) =>
      prev.map((business) => {
        if (business.id === businessId) {
          return {
            ...business,
            clientIds: business.clientIds.filter((id) => id !== clientId),
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
        addClientToBusiness,
        removeClientFromBusiness,
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
