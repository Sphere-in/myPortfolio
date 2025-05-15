"use client"

import { AuthProvider } from "../../contexts/AuthContext"
import  React from "react"

import { ThemeProvider } from "@/components/ui/theme-provider"

export default function AdminLayout({ children }) {
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="dark">
        <div className="min-h-screen bg-background text-foreground">{children}</div>
      </ThemeProvider>
    </AuthProvider>
  )
}
