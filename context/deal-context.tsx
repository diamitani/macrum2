"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { generateId } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import type { Deal, DealStage, DealActivity } from "@/types/deal"

interface DealContextType {
  deals: Deal[]
  isLoading: boolean
  addDeal: (dealData: Omit<Deal, "id" | "createdAt" | "updatedAt" | "activities">) => Promise<Deal | null>
  updateDeal: (dealId: string, updates: Partial<Deal>) => Promise<Deal | null>
  deleteDeal: (dealId: string) => Promise<boolean>
  getDealById: (dealId: string) => Deal | undefined
  getDealsByStage: (stage: DealStage) => Deal[]
  addDealActivity: (dealId: string, text: string) => Promise<DealActivity | null>
}

const DealContext = createContext<DealContextType | undefined>(undefined)

const DEAL_STORAGE_KEY = "macrum_deals"

export const DealProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [deals, setDeals] = useState<Deal[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const storedDeals = localStorage.getItem(DEAL_STORAGE_KEY)
      if (storedDeals) {
        setDeals(JSON.parse(storedDeals))
      }
    } catch (error) {
      console.error("Failed to load deals from localStorage:", error)
      toast({
        title: "Error",
        description: "Could not load deals. Your deal data might be corrupted.",
        variant: "destructive",
      })
      localStorage.removeItem(DEAL_STORAGE_KEY) // Clear corrupted data
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!isLoading) {
      // Only save if initial load is complete
      try {
        localStorage.setItem(DEAL_STORAGE_KEY, JSON.stringify(deals))
      } catch (error) {
        console.error("Failed to save deals to localStorage:", error)
        toast({
          title: "Error",
          description: "Could not save deals. Please try again.",
          variant: "destructive",
        })
      }
    }
  }, [deals, isLoading])

  const addDeal = useCallback(
    async (dealData: Omit<Deal, "id" | "createdAt" | "updatedAt" | "activities">): Promise<Deal | null> => {
      if (!dealData.name) {
        toast({ title: "Error", description: "Deal must have a name.", variant: "destructive" })
        return null
      }
      const newDeal: Deal = {
        id: generateId(),
        ...dealData,
        activities: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setDeals((prevDeals) => [...prevDeals, newDeal])
      toast({ title: "Success", description: `Deal "${newDeal.name}" created.` })
      return newDeal
    },
    [],
  )

  const updateDeal = useCallback(async (dealId: string, updates: Partial<Deal>): Promise<Deal | null> => {
    let updatedDeal: Deal | null = null
    setDeals((prevDeals) =>
      prevDeals.map((deal) => {
        if (deal.id === dealId) {
          const updated: Deal = {
            ...deal,
            ...updates,
            id: deal.id, // id is immutable
            activities: updates.activities ?? deal.activities,
            updatedAt: new Date().toISOString(),
          }
          updatedDeal = updated
          return updated
        }
        return deal
      }),
    )
    if (updatedDeal) {
      toast({ title: "Success", description: `Deal "${(updatedDeal as Deal).name}" updated.` })
      return updatedDeal
    } else {
      toast({ title: "Error", description: "Deal not found for update.", variant: "destructive" })
      return null
    }
  }, [])

  const deleteDeal = useCallback(
    async (dealId: string): Promise<boolean> => {
      const dealToDelete = deals.find((d) => d.id === dealId)
      if (!dealToDelete) {
        toast({ title: "Error", description: "Deal not found for deletion.", variant: "destructive" })
        return false
      }
      setDeals((prevDeals) => prevDeals.filter((deal) => deal.id !== dealId))
      toast({ title: "Success", description: `Deal "${dealToDelete.name}" deleted.` })
      return true
    },
    [deals],
  )

  const getDealById = useCallback((dealId: string) => deals.find((deal) => deal.id === dealId), [deals])

  const getDealsByStage = useCallback((stage: DealStage) => deals.filter((deal) => deal.stage === stage), [deals])

  const addDealActivity = useCallback(
    async (dealId: string, text: string): Promise<DealActivity | null> => {
      const trimmed = text.trim()
      if (!trimmed) {
        toast({ title: "Error", description: "Note cannot be empty.", variant: "destructive" })
        return null
      }
      const deal = deals.find((d) => d.id === dealId)
      if (!deal) {
        toast({ title: "Error", description: "Deal not found.", variant: "destructive" })
        return null
      }
      const activity: DealActivity = {
        id: generateId(),
        text: trimmed,
        createdAt: new Date().toISOString(),
      }
      // Append-only: never edits or removes existing entries
      setDeals((prevDeals) =>
        prevDeals.map((d) =>
          d.id === dealId
            ? { ...d, activities: [...(d.activities ?? []), activity], updatedAt: new Date().toISOString() }
            : d,
        ),
      )
      return activity
    },
    [deals],
  )

  return (
    <DealContext.Provider
      value={{
        deals,
        isLoading,
        addDeal,
        updateDeal,
        deleteDeal,
        getDealById,
        getDealsByStage,
        addDealActivity,
      }}
    >
      {children}
    </DealContext.Provider>
  )
}

export const useDeals = () => {
  const context = useContext(DealContext)
  if (context === undefined) {
    throw new Error("useDeals must be used within a DealProvider")
  }
  return context
}
