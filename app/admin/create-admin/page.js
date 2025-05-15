"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { useAuth } from "@/contexts/AuthContext"
import { getAuth } from "firebase/auth"

export default function CreateAdminPage() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { isAuthenticated, isAdmin } = useAuth()
  const auth = getAuth()

  if (typeof window === 'undefined') {
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email) {
      toast.error("Please enter an email address")
      return
    }

    setIsSubmitting(true)

    try {
      // Get the current user's ID token
      const currentUser = auth.currentUser

      if (!currentUser) {
        throw new Error("You must be logged in")
      }

      const idToken = await currentUser.getIdToken()

      const response = await fetch("/api/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "setAdmin",
          email,
          idToken,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to create admin")
      }

      toast.success(`Admin privileges granted to ${email}`)
      setEmail("")
    } catch (error) {
      console.error("Error creating admin:", error)
      toast.error(error.message || "Failed to create admin")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Unauthorized</CardTitle>
            <CardDescription>You don't have permission to access this page.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create Admin User</CardTitle>
          <CardDescription>Grant admin privileges to another user</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Processing..." : "Grant Admin Privileges"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
