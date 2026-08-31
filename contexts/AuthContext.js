"use client"

import { createContext, useContext, useState, useEffect, } from "react"
import { onAuthStateChanged, } from "firebase/auth"
import { toast } from "sonner"
import { auth, loginWithEmailAndPassword, logoutUser } from "@/lib/firebase"



const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  isLoading: true,
  login: async () => ({ success: false, error: "Login failed" }),
  logout: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)

      if (user) {
        try {
          // Get the ID token with fresh claims
          const idTokenResult = await user.getIdTokenResult(true)
          setIsAdmin(!!idTokenResult.claims.admin)
        } catch (error) {
          console.error("Error checking admin status:", error)
          setIsAdmin(false)
        }
      } else {
        setIsAdmin(false)
      }

      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async (email, password) => {
    try {
      const user = await loginWithEmailAndPassword(email, password)
      const idTokenResult = await user.getIdTokenResult(true)

      if (!idTokenResult.claims.admin) {
        await logoutUser()
        toast.error("You don't have admin privileges")
        return { success: false, error: "This Firebase user does not have the admin claim." }
      }

      toast.success("Logged in successfully")
      return { success: true }
    } catch (error) {
      console.error("Login error:", error)
      const messages = {
        "auth/invalid-credential": "No Firebase Authentication user matches that email and password.",
        "auth/user-not-found": "No Firebase Authentication user exists for that email.",
        "auth/wrong-password": "The Firebase Authentication password is incorrect.",
        "auth/operation-not-allowed": "Enable Email/Password sign-in in the Firebase Authentication console.",
        "auth/too-many-requests": "Too many sign-in attempts. Please wait and try again.",
      }
      const message = messages[error.code] || error.message || "Login failed"
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const logout = async () => {
    try {
      await logoutUser()
      toast.success("Logged out successfully")
    } catch (error) {
      console.error("Logout error:", error)
      toast.error("Logout failed")
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user && isAdmin,
        isAdmin,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
