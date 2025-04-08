"use client"
import { Toaster } from "sonner"
import { AuthProvider } from "../contexts/AuthContexts"
// import { ThemeProvider } from "@/components/theme-provider"
import { ThemeProvider } from "@/components/ui/theme-provider"

export default function AdminLayout({ children }) {
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="dark">
        <div className="min-h-screen bg-background text-foreground">
          {children}
          <Toaster />
        </div>
      </ThemeProvider>
    </AuthProvider>
  )
}
