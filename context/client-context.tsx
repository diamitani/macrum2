"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { toast } from "@/components/ui/use-toast"
import { generateId } from "@/lib/utils" // Assuming generateId is in utils

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
  addClient: (clientData: Omit<Client, "id" | "createdAt" | "updatedAt">) => Client
  updateClient: (id: string, updates: Partial<Omit<Client, "id" | "createdAt">>) => void
  deleteClient: (id: string) => void
  getClientById: (id: string) => Client | undefined
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

  useEffect(() => {
    try {
      const storedClients = localStorage.getItem(LOCAL_STORAGE_KEY)
      if (storedClients) {
        setClients(JSON.parse(storedClients))
      }
    } catch (error) {
      console.error("Failed to load clients from localStorage:", error)
      toast({
        title: "Error",
        description: "Could not load client data. Storage might be corrupted.",
        variant: "destructive",
      })
      // Optionally clear corrupted storage
      // localStorage.removeItem(LOCAL_STORAGE_KEY);
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(clients))
      } catch (error) {
        console.error("Failed to save clients to localStorage:", error)
        toast({
          title: "Error",
          description: "Could not save client data.",
          variant: "destructive",
        })
      }
    }
  }, [clients, isLoading])

  const addClient = useCallback((clientData: Omit<Client, "id" | "createdAt" | "updatedAt">): Client => {
    const newClient: Client = {
      ...clientData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setClients((prevClients) => [...prevClients, newClient])
    toast({ title: "Success", description: `Client "${newClient.name}" added.` })
    return newClient
  }, [])

  const updateClient = useCallback(
    (id: string, updates: Partial<Omit<Client, "id" | "createdAt">>) => {
      setClients((prevClients) =>
        prevClients.map((client) =>
          client.id === id ? { ...client, ...updates, updatedAt: new Date().toISOString() } : client,
        ),
      )
      const updatedClient = clients.find((c) => c.id === id)
      toast({ title: "Success", description: `Client "${updatedClient?.name || id}" updated.` })
    },
    [clients],
  )

  const deleteClient = useCallback(
    (id: string) => {
      const clientToDelete = clients.find((c) => c.id === id)
      setClients((prevClients) => prevClients.filter((client) => client.id !== id))
      // TODO: Consider implications for projects/tasks linked to this client
      toast({ title: "Success", description: `Client "${clientToDelete?.name || id}" deleted.` })
    },
    [clients],
  )

  const getClientById = useCallback(
    (id: string) => {
      return clients.find((client) => client.id === id)
    },
    [clients],
  )

  return (
    <ClientContext.Provider value={{ clients, addClient, updateClient, deleteClient, getClientById, isLoading }}>
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
