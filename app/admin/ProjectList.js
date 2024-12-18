'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function ProjectList() {
  const [projectData, setProjectData] = useState({
    title: '',
    description: '',
    githubLink: '',
    technologies: '',
    startDate: '',
    endDate: '',
    imageUrl: '',
  })
  const [projects, setProjects] = useState([])
  const [error, setError] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const router = useRouter()

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      if (response.ok) {
        const data = await response.json()
        setProjects(data)
      } else {
        throw new Error('Failed to fetch projects')
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
      setError(error.message)
    }
  }



  const handleEdit = (project) => {
    setProjectData(project)
    setEditingId(project.id)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        const response = await fetch('/api/projects', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
        })

        if (response.ok) {
          alert('Project deleted successfully')
          fetchProjects()
        } else {
          throw new Error('Failed to delete project')
        }
      } catch (error) {
        console.error('Error deleting project:', error)
        setError(error.message)
      }
    }
  }

  return (
    <div className="min-h-screen bg-green-900 text-white p-8">
      

      <h2 className="text-2xl font-bold mb-4">Project List</h2>
      <div className="space-y-4">
        {projects.map((project) => (
          <div key={project.id} className="bg-green-800 p-4 rounded">
            <h3 className="text-xl font-bold">{project.title}</h3>
            <p>{project.description}</p>
            <p>Technologies: {project.technologies}</p>
            <p>Start Date: {project.startDate}</p>
            <p>End Date: {project.endDate}</p>
            {project.imageUrl && (
              <Image src={project.imageUrl} alt={project.title} width={100} height={100} />
            )}
            <div className="mt-2">
              <button
                onClick={() => handleEdit(project)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(project.id)}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

