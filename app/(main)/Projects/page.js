'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

export default function ProjectsPage() {
  const [projects, setProjects] = useState([])

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch('/api/projects')
        if (response.ok) {
          const data = await response.json()
          setProjects(data)
        } else {
          console.error('Failed to fetch projects')
        }
      } catch (error) {
        console.error('Error fetching projects:', error)
      }
    }

    fetchProjects()
  }, [])

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-16 space-y-32">
        {projects.map((project, index) => (
          <div
            key={project.id}
            className={`flex flex-col ${
              index % 2 === 0 ? 'md:flex-row-reverse' : 'md:flex-row'
            } gap-8 md:gap-16 items-center`}
          >
            <div className="w-full md:w-1/2 relative aspect-video">
              <Image
                src={project.imageUrl || '/placeholder.svg?height=300&width=400'}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="rounded-lg object-cover"
              />
            </div>
            <div className="w-full md:w-1/2 space-y-4">
              <h2 className="text-2xl font-bold">{project.title}</h2>
              <div className="flex flex-wrap gap-2 text-xs text-neutral-400">
                <span>TECH:</span>
                {project.technologies.split(',').map((tech, index, array) => (
                  <span key={tech.trim()}>
                    {tech.trim()}
                    {index < array.length - 1 && ', '}
                  </span>
                ))}
              </div>
              <p className="text-neutral-400 leading-relaxed">
                {project.description}
              </p>
              <div className="flex items-center gap-6 pt-4">
                <Link
                  href={project.githubLink}
                  className="flex items-center gap-2 text-sm hover:text-neutral-400 transition-colors"
                >
                  GitHub <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href={`/projects/${project.id}`}
                  className="flex items-center gap-2 text-sm hover:text-neutral-400 transition-colors"
                >
                  Show more <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      {projects.length === 0 && (
        <p className="text-center text-xl mt-12">No projects added yet.</p>
      )}
    </div>
  )
}

