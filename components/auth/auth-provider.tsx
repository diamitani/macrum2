"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { toast } from "@/components/ui/use-toast"

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  createdAt: string
  isSetupComplete?: boolean
  setupData?: any
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  showSetupWizard: boolean
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signOut: () => Promise<void>
  completeSetup: (setupData: any) => Promise<void>
  skipSetup: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock authentication for preview environment
const mockAuth = {
  async signInWithEmail(email: string, password: string) {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (email === "demo@example.com" && password === "password") {
      const user: User = {
        id: "demo-user-123",
        email,
        name: "Demo User",
        createdAt: new Date().toISOString(),
        isSetupComplete: true, // Demo user has completed setup
      }
      return { user, error: null }
    }

    throw new Error("Invalid credentials")
  },

  async signUp(email: string, password: string, name: string) {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const user: User = {
      id: `user-${Date.now()}`,
      email,
      name,
      createdAt: new Date().toISOString(),
      isSetupComplete: false, // New users need to complete setup
    }
    return { user, error: null }
  },

  async signOut() {
    return { error: null }
  },

  async getSession() {
    const savedUser = localStorage.getItem("macrum_demo_user")
    if (savedUser) {
      return { session: { user: JSON.parse(savedUser) }, error: null }
    }
    return { session: null, error: null }
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    // Mock subscription
    return {
      data: {
        subscription: {
          unsubscribe: () => {},
        },
      },
    }
  },
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showSetupWizard, setShowSetupWizard] = useState(false)

  useEffect(() => {
    // Get initial session using mock auth
    const getSession = async () => {
      try {
        const { session } = await mockAuth.getSession()
        if (session?.user) {
          setUser(session.user)
          // Show setup wizard if user hasn't completed setup
          if (!session.user.isSetupComplete) {
            setShowSetupWizard(true)
          }
        }
      } catch (error) {
        console.error("Failed to get session:", error)
      } finally {
        setIsLoading(false)
      }
    }

    getSession()
  }, [])

  const signInWithEmail = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const { user: authUser } = await mockAuth.signInWithEmail(email, password)

      setUser(authUser)
      localStorage.setItem("macrum_demo_user", JSON.stringify(authUser))

      // Show setup wizard if user hasn't completed setup
      if (!authUser.isSetupComplete) {
        setShowSetupWizard(true)
      }

      toast({
        title: "Welcome back!",
        description: "Successfully signed in",
      })
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    setIsLoading(true)
    try {
      const { user: authUser } = await mockAuth.signUp(email, password, name)

      setUser(authUser)
      localStorage.setItem("macrum_demo_user", JSON.stringify(authUser))

      // Always show setup wizard for new users
      setShowSetupWizard(true)

      toast({
        title: "Account created!",
        description: "Welcome to Macrum",
      })
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message || "Please try again later",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    await mockAuth.signOut()
    setUser(null)
    setShowSetupWizard(false)
    localStorage.removeItem("macrum_demo_user")
    toast({
      title: "Signed out",
      description: "See you next time!",
    })
  }

  const completeSetup = async (setupData: any) => {
    if (user) {
      const updatedUser = {
        ...user,
        isSetupComplete: true,
        setupData,
      }
      setUser(updatedUser)
      localStorage.setItem("macrum_demo_user", JSON.stringify(updatedUser))
      setShowSetupWizard(false)

      toast({
        title: "Setup complete!",
        description: "Your workspace is ready to use",
      })
    }
  }

  const skipSetup = async () => {
    if (user) {
      const updatedUser = {
        ...user,
        isSetupComplete: true,
      }
      setUser(updatedUser)
      localStorage.setItem("macrum_demo_user", JSON.stringify(updatedUser))
      setShowSetupWizard(false)

      toast({
        title: "Setup skipped",
        description: "You can complete setup later in settings",
      })
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        showSetupWizard,
        signInWithEmail,
        signUp,
        signOut,
        completeSetup,
        skipSetup,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
