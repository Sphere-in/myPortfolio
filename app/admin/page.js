"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
// import { useAuth } from "../contexts/AuthContext"
import { useAuth } from "../contexts/AuthContexts"
import SubmissionsPage from "./SubmissionsPage"
import AboutUsPage from "./AboutUsPage"
import Projects from "./Projects"

const AdminPage = () => {
  const { isAuthenticated, login, logout, user } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [activePage, setActivePage] = useState("submissions")

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

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#001a1a]">
        <form onSubmit={handleLogin} className="p-8 bg-[#002626] rounded-lg shadow-xl border border-[#00FFB2]/20">
          <h1 className="mb-4 text-2xl font-bold text-[#00FFB2]">Admin Login</h1>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            className="w-full mb-4 p-2 bg-[#001a1a] border border-[#00FFB2]/20 text-[#00FFB2] rounded"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full mb-4 p-2 bg-[#001a1a] border border-[#00FFB2]/20 text-[#00FFB2] rounded"
          />
          <Button type="submit" className="w-full bg-[#00FFB2] text-[#001a1a] hover:bg-[#00FFB2]/90">
            Login
          </Button>
          {error && <p className="mt-4 text-red-500">{error}</p>}
        </form>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-[#001a1a] text-[#00FFB2]">
      <div className="w-auto p-6 border-r border-[#00FFB2]/20">
        <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
        <p className="mb-4">Logged in as: {user.email}</p>
        <nav className="space-y-2 flex flex-col">
          <Button
            onClick={() => setActivePage("submissions")}
            className={`w-full justify-start ${activePage === "submissions" ? "bg-[#00FFB2] text-[#001a1a] hover:text-[#00FFB2]" : "bg-[#002626] text-[#00FFB2]"}`}
          >
            Submissions
          </Button>
          <Button
            onClick={() => setActivePage("projects")}
            className={`w-full justify-start ${activePage === "projects" ? "bg-[#00FFB2] text-[#001a1a] hover:text-[#00FFB2]" : "bg-[#002626] text-[#00FFB2]"}`}
          >
            Edit Projects
          </Button>
          <Button
            onClick={() => setActivePage("about")}
            className={`w-full justify-start ${activePage === "about" ? "bg-[#00FFB2] text-[#001a1a] hover:text-[#00FFB2]" : "bg-[#002626] text-[#00FFB2]"}`}
          >
            Edit About Us
          </Button>
        </nav>
        <Button onClick={logout} className="w-full mt-6 bg-red-500 text-white hover:bg-red-600">
          Logout
        </Button>
      </div>
      <div className="flex-1 p-6 overflow-auto">
        {activePage === "submissions" && <SubmissionsPage />}
        {activePage === "projects" && <Projects />}
        {activePage === "about" && <AboutUsPage />}
      </div>
    </div>
  )
}

export default AdminPage

