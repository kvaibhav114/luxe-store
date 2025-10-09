"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

type User = {
  id: string
  name: string
  email: string
  token: string
}

type AuthContextType = {
  user: User | null
  login: (data: { email: string; password: string }) => Promise<void>
  register: (data: { name: string; email: string; password: string }) => Promise<void>
  logout: () => void
  // modal controls
  isAuthModalOpen: boolean
  openAuthModal: () => void
  closeAuthModal: () => void
  // ✅ new
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  // load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  // LOGIN
  const login = async (data: { email: string; password: string }) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error("Login failed")
    const result = await res.json()

    const loggedInUser: User = {
      id: result.user.id,
      name: result.user.name,
      email: result.user.email,
      token: result.token,
    }

    setUser(loggedInUser)
    localStorage.setItem("user", JSON.stringify(loggedInUser))
    closeAuthModal()
  }

  // REGISTER
  const register = async (data: { name: string; email: string; password: string }) => {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error("Registration failed")
    const result = await res.json()

    const newUser: User = {
      id: result.user.id,
      name: result.user.name,
      email: result.user.email,
      token: result.token,
    }

    setUser(newUser)
    localStorage.setItem("user", JSON.stringify(newUser))
    closeAuthModal()
  }

  // LOGOUT
  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  const openAuthModal = () => setIsAuthModalOpen(true)
  const closeAuthModal = () => setIsAuthModalOpen(false)

  // ✅ derive auth state
  const isAuthenticated = !!user

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        isAuthenticated, // ✅ provided here
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
