"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { auth, loginWithEmailAndPassword, logoutUser } from "../../firebase"
import { onAuthStateChanged } from "firebase/auth"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async (email, password) => {
    try {
      await loginWithEmailAndPassword(email, password)
      return true
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const logout = async () => {
    try {
      await logoutUser()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}





// 'use client'

// import React, { createContext, useState, useContext, useEffect } from 'react'

// const AuthContext = createContext()

// export const AuthProvider = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false)

//   useEffect(() => {
//     const storedAuth = localStorage.getItem('isAuthenticated')
//     if (storedAuth === 'true') {
//       setIsAuthenticated(true)
//     }
//   }, [])

//   const login = (password) => {
//     // In a real application, you would validate against a secure backend
//     if (password === 'admin123') {
//       setIsAuthenticated(true)
//       localStorage.setItem('isAuthenticated', 'true')
//       return true
//     }
//     return false
//   }

//   const logout = () => {
//     setIsAuthenticated(false)
//     localStorage.removeItem('isAuthenticated')
//   }

//   return (
//     <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export const useAuth = () => useContext(AuthContext)