'use client'



import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { useAuth } from '../contexts/AuthContexts'
import SubmissionsPage from './SubmissionsPage'
import AboutUsPage from './AboutUsPage'
import Projects from './Projects2'
import ProjectList from './ProjectList'


const  AdminPage = ()=> {
  const { isAuthenticated, login, logout } = useAuth()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [activePage, setActivePage] = useState('submissions')

  const handleLogin = (e) => {
    e.preventDefault()
    setError('')
    if (login(password)) {
      setPassword('')
    } else {
      setError('Invalid password. Please try again.')
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#001a1a] ">
        <form onSubmit={handleLogin} className="p-8 bg-[#002626] rounded-lg shadow-xl border border-[#00FFB2]/20">
          <h1 className="mb-4 text-2xl font-bold text-[#00FFB2]">Admin Login</h1>
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
    <div className="flex h-screen bg-[#001a1a] text-[#00FFB2] ">
      <div className="w-auto p-6  border-r border-[#00FFB2]/20">
        <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
        <nav className="space-y-2 flex flex-col">
          <Button
            onClick={() => setActivePage('submissions')}
            className={`w-full justify-start ${activePage === 'submissions' ? 'bg-[#00FFB2] text-[#001a1a]' : 'bg-[#002626] text-[#00FFB2]'}`}
          >
            Submissions
          </Button>
          
          <Button
            onClick={() => setActivePage('projects')}
            className={`w-full justify-start ${activePage === 'projects' ? 'bg-[#00FFB2] text-[#001a1a]' : 'bg-[#002626] text-[#00FFB2]'}`}
          >
            Edit Projects
          </Button>
          <Button
            onClick={() => setActivePage('projectslist')}
            className={`w-full justify-start ${activePage === 'projectslist' ? 'bg-[#00FFB2] text-[#001a1a]' : 'bg-[#002626] text-[#00FFB2]'}`}
          >
            Project List
          </Button>
          <Button
            onClick={() => setActivePage('about')}
            className={`w-full justify-start ${activePage === 'about' ? 'bg-[#00FFB2] text-[#001a1a]' : 'bg-[#002626] text-[#00FFB2]'}`}
          >
            Edit About Us
          </Button>
        </nav>
        <Button onClick={logout} className="w-full mt-6 bg-red-500 text-white hover:bg-red-600">
          Logout
        </Button>
      </div>
      <div className="flex-1 p-6 overflow-auto">
        {activePage === 'submissions' && <SubmissionsPage />}
        {/* {activePage === 'projects' && <ProjectsPage />} */}
        {activePage === 'projects' && <Projects />}
        {activePage === 'projectslist' && <ProjectList/>}
        {activePage === 'about' && <AboutUsPage />}
      </div>
    </div>
  )
}

export default AdminPage;