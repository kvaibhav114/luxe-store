"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { Header } from "@/components/header"
import { ChatbotButton } from "@/components/chatbot-button"

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith("/admin")
  return (
    <>
      {!isAdmin && <Header />}
      {children}
      {!isAdmin && <ChatbotButton />}
    </>
  )
}
