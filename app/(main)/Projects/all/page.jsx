"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { getProjects } from "@/lib/firebase"

export default function AllProjectsPage() {
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
      <div className="max-w-7xl mx-auto px-4 py-16 space-y-12">
        <div className="flex justify-between items-center">
          <Link href="/" className="inline-flex items-center text-sm hover:text-neutral-400 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Projects
          </Link>
          <h1 className="text-3xl font-bold">All Projects</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <Link key={project.id} href={`/Projects/${project.slug}?return=${encodeURIComponent('/Projects/all')}`} className="group block">
              <div className="space-y-4 hover:opacity-90 transition-opacity">
                <div className="w-full relative aspect-video overflow-hidden rounded-lg">
                {console.log(project)} 
                  <Image
                     src={
                      project.imageUrl ||
                      (project.imageUrls && project.imageUrls.length > 0
                        ? project.imageUrls[0]
                        : "/next.svg?bg=white")
                    }
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-bold group-hover:text-neutral-300 transition-colors">{project.title}</h2>
                  <div className="flex flex-wrap gap-1 text-xs text-neutral-400">
                    {project.technologies
                      .split(",")
                      .slice(0, 3)
                      .map((tech, techIndex, array) => (
                        <span key={tech.trim()}>
                          {tech.trim()}
                          {techIndex < array.length - 1 && ", "}
                        </span>
                      ))}
                    {project.technologies.split(",").length > 3 && "..."}
                  </div>
                  <p className="text-neutral-400 text-sm line-clamp-2">{project.description}</p>
                  <div className="flex items-center text-sm pt-2 text-white group-hover:text-neutral-300 transition-colors">
                    View Project <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {projects.length === 0 && <p className="text-center text-xl mt-12">No projects added yet.</p>}
      </div>
    </div>
  )
}
