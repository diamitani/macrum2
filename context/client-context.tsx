"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { toast } from "@/components/ui/use-toast"
import { generateId } from "@/lib/utils"

// Define the Client type
export interface Client {
  id: string
  name: string
  email?: string
  phone?: string
  address?: string
  businessId?: string // To link client to a business
  projectIds?: string[] // To link client to projects
  createdAt: string
  updatedAt: string
}

// Define the context type
interface ClientContextType {
  clients: Client[]
  addClient: (client: Omit<Client, "id" | "createdAt" | "updatedAt">) => Client
  updateClient: (id: string, client: Partial<Client>) => Client | undefined
  deleteClient: (id: string) => boolean
  getClientById: (id: string) => Client | undefined
  getClientsByBusiness: (businessId: string) => Client[]
  getClientsByProject: (projectId: string) => Client[]
  isLoading: boolean
}

// Create the context
const ClientContext = createContext<ClientContextType | undefined>(undefined)

// LocalStorage key
const LOCAL_STORAGE_KEY = "macrum_clients"

// Create the provider component
export function ClientProvider({ children }: { children: React.ReactNode }) {
  const [clients, setClients] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load clients from localStorage on mount
  useEffect(() => {
    const loadClients = () => {
      try {
        const savedClients = localStorage.getItem(LOCAL_STORAGE_KEY)
        if (savedClients) {
          const parsedClients = JSON.parse(savedClients)
          const validClients = parsedClients.filter(
            (client: any) => client && typeof client === "object" && client.id && client.name,
          )
          setClients(validClients)
        }
      } catch (error) {
        console.error("Failed to load clients from localStorage:", error)
        localStorage.removeItem(LOCAL_STORAGE_KEY)
        toast({
          title: "Data Recovery",
          description: "Client data was corrupted and has been reset.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadClients()
  }, [])

  // Save clients to localStorage whenever they change
  useEffect(() => {
    if (!isLoading && clients.length >= 0) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(clients))
      } catch (error) {
        console.error("Failed to save clients to localStorage:", error)
        toast({
          title: "Save Error",
          description: "Failed to save client data. Please try again.",
          variant: "destructive",
        })
      }
    }
  }, [clients, isLoading])

  const addClient = useCallback((clientData: Omit<Client, "id" | "createdAt" | "updatedAt">) => {
    try {
      const now = new Date().toISOString()
      const newClient: Client = {
        id: generateId(),
        ...clientData,
        createdAt: now,
        updatedAt: now,
      }

      setClients(prev => [...prev, newClient])

      toast({
        title: "Success",
        description: `Client "${newClient.name}" has been created successfully.`,
      })

      return newClient
    } catch (error) {
      console.error("Failed to add client:", error)
      toast({
        title: "Error",
        description: "Failed to create client. Please try again.",
        variant: "destructive",
      })
      throw error
    }
  }, [])

  const updateClient = useCallback((id: string, clientData: Partial<Client>) => {
    try {
      let updatedClient: Client | undefined

      setClients(prev => {
        const updated = prev.map(client => {
          if (client.id === id) {
            updatedClient = {
              ...client,
              ...clientData,
              updatedAt: new Date().toISOString(),
            }
            return updatedClient
          }
          return client
        })
        return updated
      })

      if (updatedClient) {
        toast({
          title: "Success",
          description: `Client "${updatedClient.name}" has been updated.`,
        })
      }

      return updatedClient
    } catch (error) {
      console.error("Failed to update client:", error)
      toast({
        title: "Error",
        description: "Failed to update client. Please try again.",
        variant: "destructive",
      })
      return undefined
    }
  }, [])

  const deleteClient = useCallback((id: string) => {
    try {
      const client = clients.find(c => c.id === id)
      if (!client) return false

      setClients(prev => prev.filter(c => c.id !== id))

      toast({
        title: "Success",
        description: `Client "${client.name}" has been deleted.`,
      })

      return true
    } catch (error) {
      console.error("Failed to delete client:", error)
      toast({
        title: "Error",
        description: "Failed to delete client. Please try again.",
        variant: "destructive",
      })
      return false
    }
  }, [clients])

  const getClientById = useCallback((id: string) => {
    return clients.find(client => client.id === id)
  }, [clients])

  const getClientsByBusiness = useCallback((businessId: string) => {
    return clients.filter(client => client.businessId === businessId)
  }, [clients])

  const getClientsByProject = useCallback((projectId: string) => {
    return clients.filter(client => client.projectIds?.includes(projectId))
  }, [clients])

  return (
    <ClientContext.Provider
      value={{
        clients,
        addClient,
        updateClient,
        deleteClient,
        getClientById,
        getClientsByBusiness,
        getClientsByProject,
        isLoading,
      }}
    >
      {children}
    </ClientContext.Provider>
  )
}

// Create a custom hook to use the context
export function useClientContext() {
  const context = useContext(ClientContext)
  if (context === undefined) {
    throw new Error("useClientContext must be used within a ClientProvider")
  }
  return context
}