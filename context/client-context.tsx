"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { toast } from "@/components/ui/use-toast"

export interface Client {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  address?: string
  notes?: string
  businessIds: string[] // Dependencies to businesses
  projectIds: string[] // Dependencies to projects
  status: "active" | "inactive" | "archived"
  createdAt: string
  updatedAt: string
}

interface ClientContextType {
  clients: Client[]
  isLoading: boolean
  getClient: (id: string) => Client | undefined
  addClient: (client: Omit<Client, "id" | "createdAt" | "updatedAt" | "businessIds" | "projectIds">) => Client
  updateClient: (id: string, client: Partial<Client>) => Client | undefined
  deleteClient: (id: string) => boolean
  addBusinessToClient: (clientId: string, businessId: string) => void
  removeBusinessFromClient: (clientId: string, businessId: string) => void
  addProjectToClient: (clientId: string, projectId: string) => void
  removeProjectFromClient: (clientId: string, projectId: string) => void
}

const ClientContext = createContext<ClientContextType | undefined>(undefined)

// Simple ID generator function
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export function ClientProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load clients from localStorage on mount
  useEffect(() => {
    const loadClients = () => {
      try {
        const savedClients = localStorage.getItem("macrum_clients")
        if (savedClients) {
          setClients(JSON.parse(savedClients))
        }
      } catch (error) {
        console.error("Failed to load clients from localStorage:", error)
        toast({
          title: "Error",
          description: "Failed to load client data. Please refresh the page.",
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
    if (!isLoading) {
      localStorage.setItem("macrum_clients", JSON.stringify(clients))
    }
  }, [clients, isLoading])

  const getClient = (id: string) => {
    return clients.find((client) => client.id === id)
  }

  const addClient = (clientData: Omit<Client, "id" | "createdAt" | "updatedAt" | "businessIds" | "projectIds">) => {
    const now = new Date().toISOString()
    const newClient: Client = {
      id: generateId(),
      ...clientData,
      createdAt: now,
      updatedAt: now,
      businessIds: [],
      projectIds: [],
      status: "active",
    }

    setClients((prev) => [...prev, newClient])
    toast({
      title: "Success",
      description: "Client created successfully!",
    })
    return newClient
  }

  const updateClient = (id: string, clientData: Partial<Client>) => {
    let updatedClient: Client | undefined

    setClients((prev) => {
      const updatedClients = prev.map((client) => {
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
      return updatedClients
    })

    if (updatedClient) {
      toast({
        title: "Success",
        description: "Client updated successfully!",
      })
    }

    return updatedClient
  }

  const deleteClient = (id: string) => {
    const clientExists = clients.some((client) => client.id === id)

    if (clientExists) {
      setClients((prev) => prev.filter((client) => client.id !== id))
      toast({
        title: "Success",
        description: "Client deleted successfully!",
      })
      return true
    }

    return false
  }

  const addBusinessToClient = (clientId: string, businessId: string) => {
    setClients((prev) =>
      prev.map((client) => {
        if (client.id === clientId && !client.businessIds.includes(businessId)) {
          return {
            ...client,
            businessIds: [...client.businessIds, businessId],
            updatedAt: new Date().toISOString(),
          }
        }
        return client
      }),
    )
  }

  const removeBusinessFromClient = (clientId: string, businessId: string) => {
    setClients((prev) =>
      prev.map((client) => {
        if (client.id === clientId) {
          return {
            ...client,
            businessIds: client.businessIds.filter((id) => id !== businessId),
            updatedAt: new Date().toISOString(),
          }
        }
        return client
      }),
    )
  }

  const addProjectToClient = (clientId: string, projectId: string) => {
    setClients((prev) =>
      prev.map((client) => {
        if (client.id === clientId && !client.projectIds.includes(projectId)) {
          return {
            ...client,
            projectIds: [...client.projectIds, projectId],
            updatedAt: new Date().toISOString(),
          }
        }
        return client
      }),
    )
  }

  const removeProjectFromClient = (clientId: string, projectId: string) => {
    setClients((prev) =>
      prev.map((client) => {
        if (client.id === clientId) {
          return {
            ...client,
            projectIds: client.projectIds.filter((id) => id !== projectId),
            updatedAt: new Date().toISOString(),
          }
        }
        return client
      }),
    )
  }

  return (
    <ClientContext.Provider
      value={{
        clients,
        isLoading,
        getClient,
        addClient,
        updateClient,
        deleteClient,
        addBusinessToClient,
        removeBusinessFromClient,
        addProjectToClient,
        removeProjectFromClient,
      }}
    >
      {children}
    </ClientContext.Provider>
  )
}

export function useClients() {
  const context = useContext(ClientContext)
  if (context === undefined) {
    throw new Error("useClients must be used within a ClientProvider")
  }
  return context
}
