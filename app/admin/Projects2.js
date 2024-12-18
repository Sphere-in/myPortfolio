'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function Projects() {
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
  const [isLoading, setIsLoading] = useState(false)
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

  const handleChange = (e) => {
    const { name, value } = e.target
    setProjectData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (file) {
      const formData = new FormData()
      formData.append('file', file)
      
      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })
        
        if (response.ok) {
          const data = await response.json()
          setProjectData((prevData) => ({
            ...prevData,
            imageUrl: data.url,
          }))
        } else {
          throw new Error('Failed to upload image')
        }
      } catch (error) {
        console.error('Error uploading image:', error)
        setError(error.message)
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/projects', {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingId ? { id: editingId, ...projectData } : projectData),
      })

      if (response.ok) {
        const result = await response.json()
        alert(result.message)
        setProjectData({
          title: '',
          description: '',
          githubLink: '',
          technologies: '',
          startDate: '',
          endDate: '',
          imageUrl: '',
        })
        setEditingId(null)
        fetchProjects()
        router.refresh()
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to save project')
      }
    } catch (error) {
      console.error('Error saving project:', error)
      setError(error.message)
    } finally {
      setIsLoading(false)
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
    <div className="min-h-screen bg-[#002626] rounded-lg  p-8">
      <h1 className="text-3xl font-bold mb-6">Project Management</h1>
      {error && (
        <div className="bg-red-600 text-white p-4 rounded mb-4">
          Error: {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div>
          <label htmlFor="title" className="block mb-1">
            Project Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={projectData.title}
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-[#001a1a] border-[#00FFB2]/20 text-[#00FFB2]"
          />
        </div>
        <div>
          <label htmlFor="description" className="block mb-1">
            Project Description
          </label>
          <textarea
            id="description"
            name="description"
            value={projectData.description}
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-[#001a1a] border-[#00FFB2]/20 text-[#00FFB2]"
            rows="4"
          ></textarea>
        </div>
        <div>
          <label htmlFor="githubLink" className="block mb-1">
            GitHub Link
          </label>
          <input
            type="url"
            id="githubLink"
            name="githubLink"
            value={projectData.githubLink}
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-[#001a1a] border-[#00FFB2]/20 text-[#00FFB2]"
          />
        </div>
        <div>
          <label htmlFor="technologies" className="block mb-1">
            Technologies Used
          </label>
          <input
            type="text"
            id="technologies"
            name="technologies"
            value={projectData.technologies}
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-[#001a1a] border-[#00FFB2]/20 text-[#00FFB2]"
          />
        </div>
        <div>
          <label htmlFor="startDate" className="block mb-1">
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={projectData.startDate}
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-[#001a1a] border-[#00FFB2]/20 text-[#00FFB2]"
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block mb-1">
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={projectData.endDate}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#001a1a] border-[#00FFB2]/20 text-[#00FFB2]"
          />
        </div>
        <div>
          <label htmlFor="image" className="block mb-1">
            Project Image
          </label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleImageUpload}
            accept="image/*"
            className="w-full p-2 rounded bg-[#001a1a] border-[#00FFB2]/20 text-[#00FFB2]"
          />
        </div>
        {projectData.imageUrl && (
          <div>
            <Image src={projectData.imageUrl} alt="Project Image" width={200} height={200} />
          </div>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className={`bg-[#00FFB2] text-[#001a1a] hover:bg-[#00FFB2]/90 font-bold py-2 px-4 rounded  ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Saving...' : (editingId ? 'Update Project' : 'Save Project')}
        </button>
      </form>

      <h2 className="text-2xl font-bold mb-4">Project List</h2>
      <div className="space-y-4">
        {projects.map((project) => (
          <div key={project.id} className="bg-[#001a1a] border-[#00FFB2]/20 text-[#00FFB2] p-4 rounded">
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
                className = "bg-[#00FFB2] text-[#001a1a] hover:bg-[#00FFB2]/90 font-bold py-1 px-2 rounded mr-2"
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

