"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ModeToggle } from "@/components/ui/Mode-Toggle"
import { useAuth } from "../../contexts/AuthContext"
import SubmissionsPage from "./SubmissionsPage"
import AboutUsPage from "./AboutUsPage"
import Projects from "./Projects"
import { FileText, FolderKanban, Info, LogOut, Menu, UserPlus } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from "@/components/ui/sheet"
import { useRouter } from "next/navigation"

export default function AdminPage() {
  const { isAuthenticated, login, logout, user, isLoading } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [activePage, setActivePage] = useState("submissions")
  const router = useRouter()

  useEffect(() => {
    // If authentication is still loading, do nothing
    if (isLoading) return

    // If not authenticated after loading, redirect to login
    if (!isAuthenticated && !isLoading) {
      // No need to redirect, we'll show the login form
    }
  }, [isAuthenticated, isLoading, router])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    const success = await login(email, password)
    if (success) {
      setEmail("")
      setPassword("")
    } else {
      setError("Invalid email or password. Please try again.")
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="absolute top-4 right-4">
          <ModeToggle />
        </div>
        <form onSubmit={handleLogin} className="p-8 bg-card rounded-lg shadow-lg border border-border w-full max-w-md">
          <h1 className="mb-6 text-2xl font-bold text-center">Admin Login</h1>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="bg-background"
              />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
            {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
          </div>
        </form>
      </div>
    )
  }

  const NavItem = ({
    icon,
    label,
    isActive,
    onClick,
  }) => (
    <Button
      variant={isActive ? "default" : "ghost"}
      className={`w-full justify-start gap-2 ${isActive ? "" : "hover:bg-accent"}`}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </Button>
  )

  const handleNavClick = (page) => {
    setActivePage(page)
  }

  const SidebarContent = () => (
    <>
      <div className="flex items-center justify-between mb-6 px-4 pt-4">
        <h1 className="text-xl font-bold">Admin Panel</h1>
      </div>
      <p className="mb-4 text-sm text-muted-foreground px-4">Logged in as: {user?.email}</p>
      <nav className="space-y-2 px-4">
        <NavItem
          icon={<FileText className="h-4 w-4" />}
          label="Submissions"
          isActive={activePage === "submissions"}
          onClick={() => handleNavClick("submissions")}
        />
        <NavItem
          icon={<FolderKanban className="h-4 w-4" />}
          label="Edit Projects"
          isActive={activePage === "projects"}
          onClick={() => handleNavClick("projects")}
        />
        <NavItem
          icon={<Info className="h-4 w-4" />}
          label="Edit About Us"
          isActive={activePage === "about"}
          onClick={() => handleNavClick("about")}
        />
        <NavItem
          icon={<UserPlus className="h-4 w-4" />}
          label="Create Admin"
          isActive={activePage === "create-admin"}
          onClick={() => router.push("/admin/create-admin")}
        />
      </nav>
      <div className="px-4 mt-6">
        <Button onClick={logout} variant="destructive" className="w-full gap-2">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </>
  )

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border">
        <SidebarContent />
        <div className="mt-auto p-4 border-t border-border">
          <ModeToggle />
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <div className="md:hidden flex items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="absolute top-4 left-4 z-50">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-auto">
                <SheetTitle className="sr-only">Admin Menu</SheetTitle>
                <SidebarContent />
              </div>
              <div className="p-4 border-t border-border flex items-center justify-between">
                <ModeToggle />
                <SheetClose asChild>
                  <Button variant="ghost" size="sm">
                    Close
                  </Button>
                </SheetClose>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex-1 overflow-auto p-4 md:p-6 mt-10 md:mt-0">
        {activePage === "submissions" && <SubmissionsPage />}
        {activePage === "projects" && <Projects />}
        {activePage === "about" && <AboutUsPage />}
      </div>
    </div>
  )
}
