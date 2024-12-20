'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { saveProject, updateProject, deleteProject, getProjects, uploadImage, ensureAuth } from '@/firebase'

export default function Projects() {
  const [projectData, setProjectData] = useState({
    title: '',
    description: '',
    githubLink: '',
    technologies: '',
    startDate: '',
    endDate: '',
    imageUrl: '',
    display: true,
  })
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const initAuth = async () => {
      try {
        await ensureAuth();
        fetchProjects();
      } catch (error) {
        console.error('Error initializing auth:', error);
        setError('Failed to authenticate. Please try again.');
      }
    };
    initAuth();
  }, [])

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const data = await getProjects()
      setProjects(data)
    } catch (error) {
      console.error('Error fetching projects:', error)
      setError(error.message)
    } finally {
      setIsLoading(false);
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setProjectData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (file) {
      try {
        setUploadProgress(0)
        const imageUrl = await uploadImage(file)
        setProjectData((prevData) => ({
          ...prevData,
          imageUrl,
        }))
        setUploadProgress(100)
      } catch (error) {
        console.error('Error uploading image:', error)
        setError(error.message)
        setUploadProgress(0)
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (editingId) {
        await updateProject(editingId, projectData)
      } else {
        await saveProject(projectData)
      }
      alert(editingId ? 'Project updated successfully' : 'Project saved successfully')
      setProjectData({
        title: '',
        description: '',
        githubLink: '',
        technologies: '',
        startDate: '',
        endDate: '',
        imageUrl: '',
        display: true,
      })
      setEditingId(null)
      fetchProjects()
      router.refresh()
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
        await deleteProject(id)
        alert('Project deleted successfully')
        fetchProjects()
      } catch (error) {
        console.error('Error deleting project:', error)
        setError(error.message)
      }
    }
  }

  if (isLoading) {
    return <div className="min-h-screen bg-[#002626] flex items-center justify-center text-[#00FFB2]">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-[#002626] rounded-lg p-8">
      <h1 className="text-3xl font-bold mb-6 text-[#00FFB2]">Project Management</h1>
      {error && (
        <div className="bg-red-600 text-white p-4 rounded mb-4">
          Error: {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div>
          <label htmlFor="title" className="block mb-1 text-[#00FFB2]">
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
          <label htmlFor="description" className="block mb-1 text-[#00FFB2]">
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
          <label htmlFor="githubLink" className="block mb-1 text-[#00FFB2]">
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
          <label htmlFor="technologies" className="block mb-1 text-[#00FFB2]">
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
          <label htmlFor="startDate" className="block mb-1 text-[#00FFB2]">
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
          <label htmlFor="endDate" className="block mb-1 text-[#00FFB2]">
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
          <label htmlFor="image" className="block mb-1 text-[#00FFB2]">
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
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="mt-2 bg-[#001a1a] rounded-full h-2.5">
              <div
                className="bg-[#00FFB2] h-2.5 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}
        </div>
        {projectData.imageUrl && (
          <div>
            <Image src={projectData.imageUrl} alt="Project Image" width={200} height={200} />
          </div>
        )}
        <div>
          <label htmlFor="display" className="block mb-1 text-[#00FFB2]">
            Display Project
          </label>
          <input
            type="checkbox"
            id="display"
            name="display"
            checked={projectData.display}
            onChange={handleChange}
            className="rounded bg-[#001a1a] border-[#00FFB2]/20 text-[#00FFB2]"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`bg-[#00FFB2] text-[#001a1a] hover:bg-[#00FFB2]/90 font-bold py-2 px-4 rounded ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Saving...' : (editingId ? 'Update Project' : 'Save Project')}
        </button>
      </form>

      <h2 className="text-2xl font-bold mb-4 text-[#00FFB2]">Project List</h2>
      <div className="space-y-4">
        {projects.map((project) => (
          <div key={project.id} className="bg-[#001a1a] border-[#00FFB2]/20 text-[#00FFB2] p-4 rounded">
            <h3 className="text-xl font-bold">{project.title}</h3>
            <p>{project.description}</p>
            <p>Technologies: {project.technologies}</p>
            <p>Start Date: {project.startDate}</p>
            <p>End Date: {project.endDate}</p>
            <p>Display: {project.display ? 'Yes' : 'No'}</p>
            {project.imageUrl && (
              <Image src={project.imageUrl} alt={project.title} width={100} height={100} />
            )}
            <div className="mt-2">
              <button
                onClick={() => handleEdit(project)}
                className="bg-[#00FFB2] text-[#001a1a] hover:bg-[#00FFB2]/90 font-bold py-1 px-2 rounded mr-2"
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

