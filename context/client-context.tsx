"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { Client } from "@/types"

interface ClientContextType {
  clients: Client[]
  isLoading: boolean
  error: string | null
  addClient: (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateClient: (id: string, updates: Partial<Client>) => void
  deleteClient: (id: string) => void
  getClientById: (id: string) => Client | undefined
}

const ClientContext = createContext<ClientContextType | undefined>(undefined)

const LOCAL_STORAGE_KEY = "macrum_clients"

export function ClientProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load clients from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
      if (stored) {
        const parsedClients = JSON.parse(stored).map((client: any) => ({
          ...client,
          createdAt: new Date(client.createdAt),
          updatedAt: new Date(client.updatedAt),
        }))
        setClients(parsedClients)
      }
    } catch (err) {
      setError("Failed to load clients from storage")
      console.error("Error loading clients:", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save to localStorage whenever clients change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(clients))
      } catch (err) {
        setError("Failed to save clients to storage")
        console.error("Error saving clients:", err)
      }
    }
  }, [clients, isLoading])

  const addClient = (clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newClient: Client = {
        ...clientData,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      setClients(prev => [...prev, newClient])
      setError(null)
    } catch (err) {
      setError("Failed to add client")
      console.error("Error adding client:", err)
    }
  }

  const updateClient = (id: string, updates: Partial<Client>) => {
    try {
      setClients(prev =>
        prev.map(client =>
          client.id === id
            ? { ...client, ...updates, updatedAt: new Date() }
            : client
        )
      )
      setError(null)
    } catch (err) {
      setError("Failed to update client")
      console.error("Error updating client:", err)
    }
  }

  const deleteClient = (id: string) => {
    try {
      setClients(prev => prev.filter(client => client.id !== id))
      setError(null)
    } catch (err) {
      setError("Failed to delete client")
      console.error("Error deleting client:", err)
    }
  }

  const getClientById = (id: string) => {
    return clients.find(client => client.id === id)
  }

  const value: ClientContextType = {
    clients,
    isLoading,
    error,
    addClient,
    updateClient,
    deleteClient,
    getClientById,
  }

  return (
    <ClientContext.Provider value={value}>
      {children}
    </ClientContext.Provider>
  )
}

export function useClientContext() {
  const context = useContext(ClientContext)
  if (context === undefined) {
    throw new Error("useClientContext must be used within a ClientProvider")
  }
  return context
}