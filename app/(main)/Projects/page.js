"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { getProjects } from "@/firebase"

export default function ProjectsPage() {
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchProjects() {
      try {
        setIsLoading(true)
        const fetchedProjects = await getProjects()
        setProjects(fetchedProjects)
      } catch (error) {
        console.error("Error fetching projects:", error)
        setError(error.message || "An error occurred while fetching projects")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [])

  if (isLoading) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <p className="text-red-500 mb-4">Error: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-16 space-y-32">
        {projects.map((project, index) => (
          <div
            key={project.id}
            className={`flex flex-col ${
              index % 2 === 0 ? "md:flex-row-reverse" : "md:flex-row"
            } gap-8 md:gap-16 items-center`}
          >
            <div className="w-full md:w-1/2 relative aspect-video">
            <Link
            href={`/Projects/${project.id}`}>
              <Image
                src={project.imageUrl || "/placeholder.svg?height=300&width=400"}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="rounded-lg object-cover"
              />


            </Link>
            </div>
            <div className="w-full md:w-1/2 space-y-4">
              <h2 className="text-2xl font-bold">{project.title}</h2>
              <div className="flex flex-wrap gap-2 text-xs text-neutral-400">
                <span>TECH:</span>
                {project.technologies.split(",").map((tech, techIndex, array) => (
                  <span key={tech.trim()}>
                    {tech.trim()}
                    {techIndex < array.length - 1 && ", "}
                  </span>
                ))}
              </div>
              <p className="text-neutral-400 leading-relaxed">{project.description}</p>
              <div className="flex items-center gap-6 pt-4">
                <Link
                  href={project.githubLink}
                  className="flex items-center gap-2 text-sm hover:text-neutral-400 transition-colors"
                >
                  GitHub <ArrowRight className="w-4 h-4" />
                </Link>

                {index === projects.length - 1 && (
                  <Link
                    // href={`/projects/${project.id}`}
                    href={`Projects/all`}
                    className="flex items-center gap-2 text-sm hover:text-neutral-400 transition-colors"
                  >
                    Show more <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {projects.length === 0 && <p className="text-center text-xl mt-12">No projects added yet.</p>}
    </div>
  )
}

