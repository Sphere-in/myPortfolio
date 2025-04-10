"use client"

import { useState, useEffect } from "react"
import { use } from "react" // Added import for React.use
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Github, Globe } from "lucide-react"
import { getProjectById } from "@/lib/firebase"

export default function ProjectDetailPage({ params }) {
  // Unwrap params with React.use() to resolve the Promise
  const resolvedParams = use(params)
  const projectId = resolvedParams.id

  const [project, setProject] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Define the fetch function outside to avoid state updates during render
    async function fetchProject() {
      try {
        setIsLoading(true)
        const fetchedProject = await getProjectById(projectId)
        if (!fetchedProject) {
          throw new Error("Project not found")
        }
        setProject(fetchedProject)
      } catch (error) {
        console.error("Error fetching project:", error)
        setError(error.message || "An error occurred while fetching the project")
      } finally {
        setIsLoading(false)
      }
    }

    // Only fetch if projectId is available
    if (projectId) {
      fetchProject()
    }
  }, [projectId]) // Updated dependency

  if (isLoading) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <p className="text-red-500 mb-4">Error: {error}</p>
        <Link href="/" className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200">
          Back to Projects
        </Link>
      </div>
    )
  }

  // Guard against attempting to render before project data is available
  if (!project) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading project data...</div>
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto px-4 py-16 space-y-12">
        <Link href="/projects" className="inline-flex items-center text-sm hover:text-neutral-400 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Projects
        </Link>

        <div className="w-full relative aspect-video">
          <Image
            src={project.imageUrl || "/placeholder.svg?height=600&width=1200"}
            alt={project.title}
            fill
            sizes="100vw"
            className="rounded-lg object-cover"
          />
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl font-bold">{project.title}</h1>

          <div className="flex flex-wrap gap-2 text-sm text-neutral-400">
            <span className="font-semibold">TECH:</span>
            {project.technologies && project.technologies.split(",").map((tech, techIndex, array) => (
              <span key={tech.trim()}>
                {tech.trim()}
                {techIndex < array.length - 1 && ", "}
              </span>
            ))}
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Description</h2>
            <p className="text-neutral-300 leading-relaxed">{project.description}</p>
          </div>

          {project.features && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Features</h2>
              <ul className="list-disc list-inside text-neutral-300 space-y-2">
                {project.features.split(",").map((feature) => (
                  <li key={feature.trim()}>{feature.trim()}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-6 pt-6">
            {project.githubLink && (
              <Link
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition-colors"
              >
                <Github className="w-4 h-4" /> GitHub Repository
              </Link>
            )}

            {project.liveLink && (
              <Link
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm border border-white px-4 py-2 rounded hover:bg-white hover:text-black transition-colors"
              >
                <Globe className="w-4 h-4" /> Live Demo
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}