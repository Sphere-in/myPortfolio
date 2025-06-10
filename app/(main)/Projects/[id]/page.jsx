"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import React from "react"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Github,
  Globe,
  Calendar,
  Users,
  Award,
  Share2,
  Maximize2,
  X,
  Clock,
  Target,
  Lightbulb,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { getProjectById, getProjectBySlug } from "@/lib/firebase"

export default function ProjectDetailPage({ params }) {
  const { id: projectId } = React.use(params)
  const searchParams = useSearchParams()
  const returnUrl = searchParams.get("return") || "/"
  // Decode the URL if it contains encoded characters
  const decodedReturnUrl = decodeURIComponent(returnUrl)

  const [project, setProject] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    async function fetchProject() {
      try {
        setIsLoading(true)
        const fetchedProject = await getProjectBySlug(projectId)
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

    if (projectId) {
      fetchProject()
    }
  }, [projectId])

  // Handle image navigation
  const nextImage = () => {
    if (project?.imageUrls?.length > 0) {
      setCurrentImageIndex((prev) => (prev === project.imageUrls.length - 1 ? 0 : prev + 1))
    }
  }

  const prevImage = () => {
    if (project?.imageUrls?.length > 0) {
      setCurrentImageIndex((prev) => (prev === 0 ? project.imageUrls.length - 1 : prev - 1))
    }
  }

  const selectImage = (index) => {
    setCurrentImageIndex(index)
  }

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxOpen) {
        if (e.key === "ArrowRight") nextImage()
        if (e.key === "ArrowLeft") prevImage()
        if (e.key === "Escape") setLightboxOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [lightboxOpen])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <p className="text-red-500 mb-4">Error: {error}</p>
        <Link href="/projects" className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200">
          Back to Projects
        </Link>
      </div>
    )
  }

  // Guard against project not found
  if (!project) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <p className="text-red-500 mb-4">Error: Project not found</p>
        <Link href="/projects" className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200">
          Back to Projects
        </Link>
      </div>
    )
  }

  // Handle legacy projects with single imageUrl
  const images = project.imageUrls || (project.imageUrl ? [project.imageUrl] : [])

  return (
    <div className="min-h-screen bg-black text-white mt-5">
      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && images.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 text-white p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
              aria-label="Close lightbox"
            >
              <X className="w-6 h-6" />
            </button>

            <button
              onClick={prevImage}
              className="absolute left-4 md:left-8 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={nextImage}
              className="absolute right-4 md:right-8 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-full max-w-5xl h-[80vh] mx-4 "
            >
              <Image
                src={images[currentImageIndex] || "/placeholder.svg"}
                alt={`${project.title} - Image ${currentImageIndex + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 1200px"
                className="object-contain "
                priority
              />

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {images.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto px-4 py-8 md:py-16 space-y-8 md:space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link href={returnUrl} className="inline-flex items-center text-sm hover:text-neutral-400 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Projects
          </Link>

          <div className="flex items-center gap-3">
            <button
            
              onClick={() => {
                const cleanUrl = window.location.origin + window.location.pathname

                if (navigator.share) {
                  navigator.share({
                    title: project.title,
                    text: project.description,
                    url: cleanUrl,
                  })
                } else {
                  navigator.clipboard.writeText(window.location.href)
                  alert("Link copied to clipboard!")
                }
              }}
              className="flex items-center gap-2 text-sm bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 rounded-full transition-colors"
            >
              <Share2 className="w-4 h-4" /> Share
            </button>

            {project.githubLink && (
              <Link
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 rounded-full transition-colors"
              >
                <Github className="w-4 h-4" /> GitHub
              </Link>
            )}

            {project.liveLink && (
              <Link
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm bg-purple-900 hover:bg-purple-800 px-3 py-1.5 rounded-full transition-colors"
              >
                <Globe className="w-4 h-4" /> Live Demo
              </Link>
            )}
          </div>
        </div>

        {/* Project Header */}
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold">{project.title}</h1>
            {project.subtitle && <p className="text-xl text-neutral-400 mt-2">{project.subtitle}</p>}
          </div>

          {project.technologies && (
            <div className="flex flex-wrap gap-2">
              {project.technologies.split(",").map((tech) => (
                <span
                  key={tech.trim()}
                  className="px-3 py-1 bg-purple-900/30 text-purple-300 rounded-full text-xs font-medium"
                >
                  {tech.trim()}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Image Gallery */}
        {images.length > 0 && (
          <div className="space-y-4">
            {/* Main Image with Navigation */}
            <div className="w-full relative aspect-video group rounded-xl overflow-hidden">
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full"
              >
                <Image
                  src={images[currentImageIndex] || "/placeholder.svg"}
                  alt={`${project.title} - Image ${currentImageIndex + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 1200px"
                  className="object-cover"
                  priority
                />
              </motion.div>

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>

                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Fullscreen button */}
              <button
                onClick={() => setLightboxOpen(true)}
                className="absolute top-4 right-4 bg-black/50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="View fullscreen"
              >
                <Maximize2 className="w-5 h-5" />
              </button>

              {/* Image Counter */}
              {images.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-black/70 px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {images.length}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex overflow-x-auto gap-2 pb-2 snap-x hide-scrollbar">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => selectImage(index)}
                    className={`flex-shrink-0 w-20 h-20 md:w-24 md:h-24 relative rounded-lg overflow-hidden snap-start transition-all duration-200 m-4 ${currentImageIndex === index
                      ? "ring-2 ring-purple-500 scale-105 z-10"
                      : "opacity-70 hover:opacity-100"
                      }`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Project Content Tabs */}
        <div className="space-y-6">
          <div className="border-b border-neutral-800">
            <div className="flex overflow-x-auto hide-scrollbar">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${activeTab === "overview"
                  ? "text-white border-b-2 border-purple-500"
                  : "text-neutral-400 hover:text-white"
                  }`}
              >
                Overview
              </button>
              {(project.goals || project.outcomes || project.timeline) && (
                <button
                  onClick={() => setActiveTab("details")}
                  className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${activeTab === "details"
                    ? "text-white border-b-2 border-purple-500"
                    : "text-neutral-400 hover:text-white"
                    }`}
                >
                  Project Details
                </button>
              )}
              {project.challenges &&
                project.challenges.length > 0 &&
                project.solutions &&
                project.solutions.length > 0 && (
                  <button
                    onClick={() => setActiveTab("challenges")}
                    className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${activeTab === "challenges"
                      ? "text-white border-b-2 border-purple-500"
                      : "text-neutral-400 hover:text-white"
                      }`}
                  >
                    Challenges & Solutions
                  </button>
                )}
              {project.team && project.team.length > 0 && (
                <button
                  onClick={() => setActiveTab("team")}
                  className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${activeTab === "team"
                    ? "text-white border-b-2 border-purple-500"
                    : "text-neutral-400 hover:text-white"
                    }`}
                >
                  Team & Timeline
                </button>
              )}
            </div>
          </div>

          {/* Tab Content */}
          <div className="min-h-[300px]">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                <div className="space-y-4">
                  <p className="text-neutral-300 leading-relaxed text-lg">{project.description}</p>
                  {project.longDescription && (
                    <div className="pt-2 space-y-4">
                      {project.longDescription.split("\n\n").map((paragraph, idx) => (
                        <p key={idx} className="text-neutral-300 leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                {project.testimonial && (
                  <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 my-8">
                    <div className="flex flex-col space-y-4">
                      <div className="text-neutral-300 italic text-lg leading-relaxed">
                        "{project.testimonial.text}"
                      </div>
                      <div className="text-sm text-neutral-400">— {project.testimonial.author}</div>
                    </div>
                  </div>
                )}

                {project.features && (
                  <div className="space-y-4">
                    <h2 className="text-xl md:text-2xl font-semibold flex items-center gap-2">
                      <Award className="w-5 h-5 text-purple-400" />
                      Key Features
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {project.features.split(",").map((feature) => (
                        <div
                          key={feature.trim()}
                          className="flex items-start gap-2 bg-neutral-900/50 border border-neutral-800 rounded-lg p-3"
                        >
                          <div className="bg-purple-900/30 p-1 rounded mt-0.5">
                            <svg
                              className="w-3 h-3 text-purple-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-neutral-300">{feature.trim()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Details Tab */}
            {activeTab === "details" && (
              <div className="space-y-8">
                {project.goals && project.goals.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-xl md:text-2xl font-semibold flex items-center gap-2">
                      <Target className="w-5 h-5 text-purple-400" />
                      Project Goals
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {project.goals.map((goal, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-2 bg-neutral-900/50 border border-neutral-800 rounded-lg p-3"
                        >
                          <div className="bg-purple-900/30 p-1 rounded mt-0.5 text-xs font-bold text-purple-400">
                            {index + 1}
                          </div>
                          <span className="text-neutral-300">{goal}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {project.outcomes && project.outcomes.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-xl md:text-2xl font-semibold flex items-center gap-2">
                      <Award className="w-5 h-5 text-purple-400" />
                      Outcomes
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {project.outcomes.map((outcome, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-2 bg-neutral-900/50 border border-neutral-800 rounded-lg p-3"
                        >
                          <div className="bg-green-900/30 p-1 rounded mt-0.5">
                            <svg
                              className="w-3 h-3 text-green-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-neutral-300">{outcome}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <h2 className="text-xl md:text-2xl font-semibold">Technical Details</h2>
                  <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      {project.technologies && (
                        <div>
                          <h3 className="text-sm uppercase text-neutral-500 font-medium mb-2">Technologies Used</h3>
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.split(",").map((tech) => (
                              <span
                                key={tech.trim()}
                                className="px-3 py-1 bg-neutral-800 text-neutral-300 rounded-full text-xs font-medium"
                              >
                                {tech.trim()}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {project.timeline && (
                        <div>
                          <h3 className="text-sm uppercase text-neutral-500 font-medium mb-2">Project Timeline</h3>
                          {project.timeline.start && (
                            <div className="flex items-center gap-2 text-neutral-300">
                              <Calendar className="w-4 h-4 text-neutral-400" />
                              <span>
                                {project.timeline.start}
                                {project.timeline.end && ` — ${project.timeline.end}`}
                              </span>
                            </div>
                          )}
                          {project.timeline.duration && (
                            <div className="flex items-center gap-2 text-neutral-300 mt-1">
                              <Clock className="w-4 h-4 text-neutral-400" />
                              <span>Duration: {project.timeline.duration}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Challenges Tab */}
            {activeTab === "challenges" && project.challenges && project.solutions && (
              <div className="space-y-8">
                <div className="space-y-6">
                  <h2 className="text-xl md:text-2xl font-semibold flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-purple-400" />
                    Challenges & Solutions
                  </h2>

                  {project.challenges.map((challenge, index) => (
                    <div key={index} className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="bg-red-900/30 text-red-400 p-1.5 rounded-full flex items-center justify-center mt-0.5">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-lg font-medium">Challenge</h3>
                            <p className="text-neutral-300 mt-1">{challenge}</p>
                          </div>
                        </div>

                        {project.solutions && project.solutions[index] && (
                          <div className="flex items-start gap-3 pt-2">
                            <div className="bg-green-900/30 text-green-400 p-1.5 rounded-full flex items-center justify-center mt-0.5">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <div>
                              <h3 className="text-lg font-medium">Solution</h3>
                              <p className="text-neutral-300 mt-1">{project.solutions[index]}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Team Tab */}
            {activeTab === "team" && (
              <div className="space-y-8">
                {project.team && project.team.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-xl md:text-2xl font-semibold flex items-center gap-2">
                      <Users className="w-5 h-5 text-purple-400" />
                      Team Members
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      {project.team.map((member, index) => (
                        <div
                          key={index}
                          className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4 flex flex-col items-center text-center"
                        >
                          <div className="w-16 h-16 bg-neutral-800 rounded-full mb-3 flex items-center justify-center">
                            <span className="text-xl font-bold text-neutral-400">
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                          <h3 className="font-medium">{member.name}</h3>
                          <p className="text-sm text-neutral-400">{member.role}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {project.timeline && (
                  <div className="space-y-4">
                    <h2 className="text-xl md:text-2xl font-semibold flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-purple-400" />
                      Project Timeline
                    </h2>
                    <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
                      <div className="relative">
                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-neutral-800"></div>

                        <div className="space-y-8">
                          {project.timeline.start && (
                            <div className="relative pl-10">
                              <div className="absolute left-0 w-8 h-8 rounded-full bg-purple-900/50 border-2 border-purple-500 flex items-center justify-center">
                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                              </div>
                              <div>
                                <h3 className="font-medium text-purple-400">{project.timeline.start}</h3>
                                <p className="text-neutral-300">Project kickoff</p>
                              </div>
                            </div>
                          )}

                          <div className="relative pl-10">
                            <div className="absolute left-0 w-8 h-8 rounded-full bg-neutral-800 border-2 border-neutral-700 flex items-center justify-center">
                              <div className="w-2 h-2 bg-neutral-500 rounded-full"></div>
                            </div>
                            <div>
                              <h3 className="font-medium">Design & Planning Phase</h3>
                              <p className="text-neutral-400">Requirements gathering and initial design</p>
                            </div>
                          </div>

                          <div className="relative pl-10">
                            <div className="absolute left-0 w-8 h-8 rounded-full bg-neutral-800 border-2 border-neutral-700 flex items-center justify-center">
                              <div className="w-2 h-2 bg-neutral-500 rounded-full"></div>
                            </div>
                            <div>
                              <h3 className="font-medium">Development Phase</h3>
                              <p className="text-neutral-400">Core functionality implementation</p>
                            </div>
                          </div>

                          <div className="relative pl-10">
                            <div className="absolute left-0 w-8 h-8 rounded-full bg-neutral-800 border-2 border-neutral-700 flex items-center justify-center">
                              <div className="w-2 h-2 bg-neutral-500 rounded-full"></div>
                            </div>
                            <div>
                              <h3 className="font-medium">Testing & Refinement</h3>
                              <p className="text-neutral-400">QA testing and bug fixes</p>
                            </div>
                          </div>

                          {project.timeline.end && (
                            <div className="relative pl-10">
                              <div className="absolute left-0 w-8 h-8 rounded-full bg-green-900/50 border-2 border-green-500 flex items-center justify-center">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              </div>
                              <div>
                                <h3 className="font-medium text-green-400">{project.timeline.end}</h3>
                                <p className="text-neutral-300">Project completion and launch</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Project Links */}
        <div className="flex flex-wrap items-center gap-4 pt-8 border-t border-neutral-800">
          {project.githubLink && (
            <Link
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm bg-white text-black px-6 py-3 rounded-lg hover:bg-neutral-200 transition-colors"
            >
              <Github className="w-5 h-5" /> GitHub Repository
            </Link>
          )}

          {project.liveLink && (
            <Link
              href={project.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Globe className="w-5 h-5" /> View Live Demo
            </Link>
          )}

          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: project.title,
                  text: project.description,
                  url: window.location.href,
                })
              } else {
                navigator.clipboard.writeText(window.location.href)
                alert("Link copied to clipboard!")
              }
            }}
            className="flex items-center gap-2 text-sm border border-neutral-700 px-6 py-3 rounded-lg hover:bg-neutral-900 transition-colors ml-auto"
          >
            <Share2 className="w-5 h-5" /> Share Project
          </button>
        </div>
      </div>

      {/* Custom CSS for hiding scrollbars while allowing scrolling */}
      <style jsx global>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
