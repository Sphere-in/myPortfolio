"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { getProjects } from "@/lib/firebase"
import { adminFetch, uploadAdminImage } from "@/lib/admin-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Edit, Trash2, Save, Plus, Calendar, GitBranch, Code, Eye, EyeOff, ChevronDown, ChevronUp, Users, Target, Award, Lightbulb, X } from 'lucide-react'
import { toast } from "sonner"
export default function Projects() {
  const [projectData, setProjectData] = useState({
    title: "",
    slug: "",
    subtitle: "",
    description: "",
    longDescription: "",
    githubLink: "",
    liveLink: "",
    technologies: "",
    features: "",
    startDate: "",
    endDate: "",
    imageUrls: [],
    display: true,
    position: 0,
    // Advanced fields
    challenges: [],
    solutions: [],
    goals: [],
    outcomes: [],
    team: [],

    timeline: {
      start: "",
      end: "",
      duration: "",
    },
    testimonial: {
      text: "",
      author: "",
    },
  })

  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState(null)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [originalProjectData, setOriginalProjectData] = useState(null) // Store original data for cancel functionality
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false) // Track if slug was manually edited
  const router = useRouter()
  useEffect(() => {
    fetchProjects()
  }, [])



  // Auto-generate slug when title changes (only if slug hasn't been manually edited)
  useEffect(() => {
    if (projectData.title && !isSlugManuallyEdited) {
      const generatedSlug = generateSlug(projectData.title)
      setProjectData(prev => ({
        ...prev,
        slug: generatedSlug
      }))
    }
  }, [projectData.title, isSlugManuallyEdited])

  const fetchProjects = async () => {
    try {
      setIsLoading(true)
      const data = await getProjects()
      setProjects(data)
    } catch (error) {
      console.error("Error fetching projects:", error)
      setError(error.message)
      toast.error("Failed to load projects")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Track if slug is being manually edited
    if (name === "slug") {
      setIsSlugManuallyEdited(true);
    }

    // Handle nested properties like timeline.start
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setProjectData((prevData) => ({
        ...prevData,
        [parent]: {
          ...prevData[parent],
          [child]: type === "checkbox" ? checked : value,
        },
      }));
    } else if (name === "position") {
      // Ensure position is stored as a number
      setProjectData((prevData) => ({
        ...prevData,
        position: value === "" ? "" : parseInt(value) || 0,
      }));
    } else {
      // Regular top-level fields
      setProjectData((prevData) => ({
        ...prevData,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };


  const handleArrayChange = (index, field, value) => {
    setProjectData((prevData) => {
      const newArray = [...(prevData[field] || [])]
      newArray[index] = value
      return {
        ...prevData,
        [field]: newArray,
      }
    })
  }

  const addArrayItem = (field) => {
    setProjectData((prevData) => ({
      ...prevData,
      [field]: [...(prevData[field] || []), ""],
    }))
  }

  const removeArrayItem = (field, index) => {
    setProjectData((prevData) => ({
      ...prevData,
      [field]: prevData[field].filter((_, i) => i !== index),
    }))
  }

  const handleTeamChange = (index, key, value) => {
    setProjectData((prevData) => {
      const newTeam = [...(prevData.team || [])]
      newTeam[index] = {
        ...newTeam[index],
        [key]: value,
      }
      return {
        ...prevData,
        team: newTeam,
      }
    })
  }

  const addTeamMember = () => {
    setProjectData((prevData) => ({
      ...prevData,
      team: [...(prevData.team || []), { name: "", role: "" }],
    }))
  }

  const removeTeamMember = (index) => {
    setProjectData((prevData) => ({
      ...prevData,
      team: prevData.team.filter((_, i) => i !== index),
    }))
  }

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 0) {
      try {
        setUploadProgress(0)
        const uploadPromises = files.map((file) => uploadAdminImage(file, "project-images"))
        const imageUrls = await Promise.all(uploadPromises)

        setProjectData((prevData) => ({
          ...prevData,
          imageUrls: [...prevData.imageUrls, ...imageUrls],
        }))

        setUploadProgress(100)
        toast.success(`${files.length} image(s) uploaded successfully`)
      } catch (error) {
        console.error("Error uploading images:", error)
        setError(error.message)
        setUploadProgress(0)
        toast.error("Failed to upload images")
      }
    }
  }

  const removeImage = (indexToRemove) => {
    setProjectData((prevData) => ({
      ...prevData,
      imageUrls: prevData.imageUrls.filter((_, index) => index !== indexToRemove),
    }))
    toast.success("Image removed")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Clean up empty arrays to prevent Firebase issues
      const cleanedData = { ...projectData }

        // Convert empty arrays to empty objects for Firebase
        ;["challenges", "solutions", "goals", "outcomes"].forEach((field) => {
          if (Array.isArray(cleanedData[field])) {
            // Filter out empty strings
            cleanedData[field] = cleanedData[field].filter((item) => item && item.trim() !== "")
            // If array is empty after filtering, set to empty array explicitly
            if (cleanedData[field].length === 0) {
              cleanedData[field] = []
            }
          } else if (!cleanedData[field]) {
            // Ensure the field exists
            cleanedData[field] = []
          }
        })

      // Clean team array
      if (Array.isArray(cleanedData.team)) {
        cleanedData.team = cleanedData.team.filter(
          (member) => member && (member.name?.trim() !== "" || member.role?.trim() !== ""),
        )
        // If team array is empty after filtering, set to empty array explicitly
        if (cleanedData.team.length === 0) {
          cleanedData.team = []
        }
      } else {
        cleanedData.team = []
      }

      // Handle testimonial properly
      if (cleanedData.testimonial) {
        if (!cleanedData.testimonial.text && !cleanedData.testimonial.author) {
          // If both fields are empty, set to an empty object instead of null
          cleanedData.testimonial = { text: "", author: "" }
        } else {
          // Ensure both properties exist
          cleanedData.testimonial = {
            text: cleanedData.testimonial.text || "",
            author: cleanedData.testimonial.author || "",
          }
        }
      } else {
        cleanedData.testimonial = { text: "", author: "" }
      }

      // Ensure timeline object is properly structured
      cleanedData.timeline = {
        start: cleanedData.timeline?.start || "",
        end: cleanedData.timeline?.end || "",
        duration: cleanedData.timeline?.duration || "",
      }

      // Validate required fields before submission
      if (!cleanedData.title || !cleanedData.description) {
        throw new Error("Title and description are required.")
      }

      // Ensure slug exists, if not generate it
      if (!cleanedData.slug || cleanedData.slug.trim() === "") {
        cleanedData.slug = generateSlug(cleanedData.title)
      }

      // Ensure imageUrls is always an array
      if (!Array.isArray(cleanedData.imageUrls)) {
        cleanedData.imageUrls = []
      }

      try {
        if (editingId) {
          await adminFetch(`/api/projects/${editingId}`, { method: "PATCH", body: JSON.stringify(cleanedData) })
          toast.success("Project updated successfully")
        } else {
          await adminFetch("/api/projects", { method: "POST", body: JSON.stringify(cleanedData) })
          toast.success("Project saved successfully")
        }

        // Reset form after successful save
        resetForm()
        fetchProjects()
        router.refresh()
      } catch (error) {
        console.error("Error saving project:", error)
        setError(error.message || "Failed to save project")
        toast.error(
          editingId ? `Failed to update project: ${error.message}` : `Failed to save project: ${error.message}`,
        )
      }
    } catch (error) {
      console.error("Error saving project:", error)
      setError(error.message)
      toast.error(editingId ? "Failed to update project" : "Failed to save project")
    } finally {
      setIsLoading(false)
    }
  }

  // Reset form to initial state
  const resetForm = () => {
    setProjectData({
      title: "",
      slug: "",
      position:0,
      subtitle: "",
      description: "",
      longDescription: "",
      githubLink: "",
      liveLink: "",
      technologies: "",
      features: "",
      startDate: "",
      endDate: "",
      imageUrls: [],
      display: true,
      challenges: [],
      solutions: [],
      goals: [],
      outcomes: [],
      team: [],
      timeline: {
        start: "",
        end: "",
        duration: "",
      },
      testimonial: {
        text: "",
        author: "",
      },
    })
    setEditingId(null)
    setOriginalProjectData(null)
    setShowAdvanced(false)
    setIsSlugManuallyEdited(false)
  }

  // Cancel editing and restore original data
  const handleCancel = () => {
    if (originalProjectData) {
      // If we were editing, restore the original data
      setProjectData(originalProjectData)
    } else {
      // If we were creating a new project, reset the form
      resetForm()
    }
    setEditingId(null)
    setOriginalProjectData(null)
    setIsSlugManuallyEdited(false)
    toast.info("Editing cancelled")
  }

  const handleEdit = (project) => {
    // Store the original project data for cancel functionality
    const preparedProject = {
      ...project,
      slug: project.slug || "",
      subtitle: project.subtitle || "",
      longDescription: project.longDescription || "",
      liveLink: project.liveLink || "",
      features: project.features || "",
      challenges: project.challenges || [],
      solutions: project.solutions || [],
      goals: project.goals || [],
      outcomes: project.outcomes || [],
      team: project.team || [],
      timeline: project.timeline || { start: "", end: "", duration: "" },
      testimonial: project.testimonial || { text: "", author: "" },
    }

    // Handle legacy projects with single imageUrl
    if (project.imageUrl && (!project.imageUrls || project.imageUrls.length === 0)) {
      preparedProject.imageUrls = [project.imageUrl]
    }

    setOriginalProjectData({ ...preparedProject })
    setProjectData(preparedProject)
    setEditingId(project.id)
    setIsSlugManuallyEdited(!!project.slug) // If project has a slug, consider it manually edited
    toast.info("Editing project: " + project.title)
  }

  const handleDelete = async (id) => {
    try {
      await adminFetch(`/api/projects/${id}`, { method: "DELETE" })
      toast.success("Project deleted successfully")
      fetchProjects()
      setDeleteDialogOpen(false)
    } catch (error) {
      console.error("Error deleting project:", error)
      setError(error.message)
      toast.error("Failed to delete project")
    }
  }

  const generateSlug = (title) => {
    if (!title || typeof title !== 'string') return ""

    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // Remove special characters except spaces and hyphens
      .replace(/[\s_-]+/g, "-") // Replace spaces, underscores, and multiple hyphens with single hyphen
      .replace(/^-+|-+$/g, "") // Remove leading and trailing hyphens
  }

  const handleRegenerateSlug = () => {
    if (projectData.title) {
      const newSlug = generateSlug(projectData.title)
      setProjectData(prev => ({
        ...prev,
        slug: newSlug
      }))
      setIsSlugManuallyEdited(false)
      toast.success("Slug regenerated from title")
    }
  }

  if (isLoading && projects.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading projects...</p>
        </div>
      </div>
    )
  }

  return (
    <Tabs defaultValue="form" className="w-full space-y-4">
      <TabsList className="grid w-full grid-cols-2 sm:w-auto">
        <TabsTrigger value="form" className="gap-2">
          {editingId ? <Edit className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {editingId ? "Edit Project" : "New Project"}
        </TabsTrigger>
        <TabsTrigger value="list" className="gap-2">
          <Code className="h-4 w-4" />
          Project List
        </TabsTrigger>
      </TabsList>

      <TabsContent value="form">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>{editingId ? "Edit Project" : "Add New Project"}</CardTitle>
            <CardDescription>
              {editingId
                ? "Update the details of your existing project"
                : "Fill in the details to add a new project to your portfolio"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[min(68vh,56rem)] pr-2">
              <form id="projectForm" onSubmit={handleSubmit} className="space-y-6 px-1 sm:px-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Basic Information</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Project Title</Label>
                      <Input id="title" name="title" value={projectData.title} onChange={handleChange} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subtitle">Subtitle</Label>
                      <Input id="subtitle" name="subtitle" value={projectData.subtitle} onChange={handleChange} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div className="space-y-2">
                      <Label htmlFor="slug">Slug</Label>
                      <div className="flex gap-2">
                        <Input
                          id="slug"
                          name="slug"
                          value={projectData.slug}
                          onChange={handleChange}
                          placeholder="URL-friendly version of the title"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleRegenerateSlug}
                          disabled={!projectData.title}
                          className="whitespace-nowrap"
                        >
                          Regenerate
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        The slug is automatically generated from the title. You can edit it manually if needed.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="position">Position</Label>
                      <div className="flex gap-2">
                        <Input
                          id="position"
                          name="position"
                          value={projectData.position?.toString() ?? ""}
                          onChange={handleChange}
                          placeholder="0 for start at bottom, high no for top."
                        />



                      </div>

                    </div>

                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Short Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={projectData.description}
                      onChange={handleChange}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="longDescription">Long Description</Label>
                    <Textarea
                      id="longDescription"
                      name="longDescription"
                      value={projectData.longDescription}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Detailed description of your project. Use double line breaks for paragraphs."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="githubLink">GitHub Link</Label>
                      <Input
                        id="githubLink"
                        name="githubLink"
                        type="url"
                        value={projectData.githubLink}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="liveLink">Live Demo Link</Label>
                      <Input
                        id="liveLink"
                        name="liveLink"
                        type="url"
                        value={projectData.liveLink}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="technologies">Technologies Used</Label>
                    <Input
                      id="technologies"
                      name="technologies"
                      value={projectData.technologies}
                      onChange={handleChange}
                      placeholder="React, Node.js, MongoDB, etc. (comma separated)"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="features">Key Features</Label>
                    <Input
                      id="features"
                      name="features"
                      value={projectData.features}
                      onChange={handleChange}
                      placeholder="User authentication, Real-time updates, etc. (comma separated)"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        name="timeline.start"
                        value={projectData.timeline.start}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        name="timeline.end"
                        value={projectData.timeline.end}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration</Label>
                      <Input
                        id="duration"
                        name="timeline.duration"
                        value={projectData.timeline.duration}
                        onChange={handleChange}
                        placeholder="e.g. 6 months"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image">Project Images</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="image"
                        name="image"
                        type="file"
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="flex-1"
                        multiple
                      />
                      {uploadProgress > 0 && <div className="w-12 text-xs text-center">{uploadProgress}%</div>}
                    </div>
                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <div className="w-full bg-secondary h-1 mt-1 rounded-full overflow-hidden">
                        <div
                          className="bg-primary h-1 transition-all duration-300 ease-in-out"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    )}
                  </div>

                  {projectData.imageUrls && projectData.imageUrls.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                      {projectData.imageUrls.map((url, index) => (
                        <div key={index} className="relative border rounded-md p-2 inline-block group">
                          <Image
                            src={url || "/placeholder.svg"}
                            alt={`Project Preview ${index + 1}`}
                            width={200}
                            height={150}
                            className="object-cover rounded"
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeImage(index)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="display"
                      name="display"
                      checked={projectData.display}
                      onCheckedChange={(checked) => setProjectData((prev) => ({ ...prev, display: checked }))}
                    />
                    <Label htmlFor="display">Display project on website</Label>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                >
                  {showAdvanced ? (
                    <>
                      <ChevronUp className="h-4 w-4" />
                      Hide Advanced Options
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4" />
                      Show Advanced Options
                    </>
                  )}
                </Button>

                {showAdvanced && (
                  <div className="space-y-6 pt-4 border-t">
                    {/* Challenges & Solutions */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="h-5 w-5" />
                        <h3 className="text-lg font-medium">Challenges & Solutions</h3>
                      </div>

                      {projectData.challenges.map((challenge, index) => (
                        <div
                          key={`challenge-${index}`}
                          className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md"
                        >
                          <div className="space-y-2">
                            <Label htmlFor={`challenge-${index}`}>Challenge {index + 1}</Label>
                            <div className="flex gap-2">
                              <Textarea
                                id={`challenge-${index}`}
                                value={challenge}
                                onChange={(e) => handleArrayChange(index, "challenges", e.target.value)}
                                rows={3}
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                onClick={() => removeArrayItem("challenges", index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`solution-${index}`}>Solution {index + 1}</Label>
                            <Textarea
                              id={`solution-${index}`}
                              value={projectData.solutions[index] || ""}
                              onChange={(e) => handleArrayChange(index, "solutions", e.target.value)}
                              rows={3}
                            />
                          </div>
                        </div>
                      ))}

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          addArrayItem("challenges")
                          addArrayItem("solutions")
                        }}
                        className="mt-2"
                      >
                        <Plus className="h-4 w-4 mr-2" /> Add Challenge & Solution
                      </Button>
                    </div>

                    {/* Goals & Outcomes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Target className="h-5 w-5" />
                          <h3 className="text-lg font-medium">Project Goals</h3>
                        </div>

                        {projectData.goals.map((goal, index) => (
                          <div key={`goal-${index}`} className="flex gap-2">
                            <Input
                              value={goal}
                              onChange={(e) => handleArrayChange(index, "goals", e.target.value)}
                              placeholder={`Goal ${index + 1}`}
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              onClick={() => removeArrayItem("goals", index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}

                        <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("goals")}>
                          <Plus className="h-4 w-4 mr-2" /> Add Goal
                        </Button>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Award className="h-5 w-5" />
                          <h3 className="text-lg font-medium">Project Outcomes</h3>
                        </div>

                        {projectData.outcomes.map((outcome, index) => (
                          <div key={`outcome-${index}`} className="flex gap-2">
                            <Input
                              value={outcome}
                              onChange={(e) => handleArrayChange(index, "outcomes", e.target.value)}
                              placeholder={`Outcome ${index + 1}`}
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              onClick={() => removeArrayItem("outcomes", index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}

                        <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("outcomes")}>
                          <Plus className="h-4 w-4 mr-2" /> Add Outcome
                        </Button>
                      </div>
                    </div>

                    {/* Team Members */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        <h3 className="text-lg font-medium">Team Members</h3>
                      </div>

                      {projectData.team.map((member, index) => (
                        <div
                          key={`team-${index}`}
                          className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md"
                        >
                          <div className="space-y-2">
                            <Label htmlFor={`team-name-${index}`}>Name</Label>
                            <Input
                              id={`team-name-${index}`}
                              value={member.name || ""}
                              onChange={(e) => handleTeamChange(index, "name", e.target.value)}
                              placeholder="Team member name"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`team-role-${index}`}>Role</Label>
                            <div className="flex gap-2">
                              <Input
                                id={`team-role-${index}`}
                                value={member.role || ""}
                                onChange={(e) => handleTeamChange(index, "role", e.target.value)}
                                placeholder="Team member role"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                onClick={() => removeTeamMember(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}

                      <Button type="button" variant="outline" size="sm" onClick={addTeamMember}>
                        <Plus className="h-4 w-4 mr-2" /> Add Team Member
                      </Button>
                    </div>

                    {/* Testimonial */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Testimonial</h3>

                      <div className="space-y-2">
                        <Label htmlFor="testimonial-text">Testimonial Text</Label>
                        <Textarea
                          id="testimonial-text"
                          value={projectData.testimonial?.text || ""}
                          onChange={(e) =>
                            setProjectData((prev) => ({
                              ...prev,
                              testimonial: {
                                ...prev.testimonial,
                                text: e.target.value,
                              },
                            }))
                          }
                          rows={3}
                          placeholder="What others say about this project"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="testimonial-author">Author</Label>
                        <Input
                          id="testimonial-author"
                          value={projectData.testimonial?.author || ""}
                          onChange={(e) =>
                            setProjectData((prev) => ({
                              ...prev,
                              testimonial: {
                                ...prev.testimonial,
                                author: e.target.value,
                              },
                            }))
                          }
                          placeholder="Name and title/company of the person"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </ScrollArea>
          </CardContent>
          <CardFooter className="flex justify-between">
            {editingId && (
              <Button type="button" variant="outline" onClick={handleCancel} className="gap-2">
                <X className="h-4 w-4" />
                Cancel
              </Button>
            )}
            <Button type="submit" form="projectForm" disabled={isLoading} className="gap-2">
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                  {editingId ? "Updating..." : "Saving..."}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {editingId ? "Update Project" : "Save Project"}
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="list">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Project List</CardTitle>
            <CardDescription>Manage your portfolio projects</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[min(70vh,58rem)] pr-2">
              {projects.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No projects found. Add your first project using the form.
                </div>
              ) : (
                <div className="space-y-4">
                  {projects.map((project) => (
                    <Card key={project.id} className="overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        {project.imageUrls && project.imageUrls.length > 0 ? (
                          <div className="md:w-1/4 relative">
                            <Image
                              src={project.imageUrls[0] || "/placeholder.svg"}
                              alt={project.title}
                              width={200}
                              height={150}
                              className="w-full h-full object-cover aspect-video"
                            />
                            {project.imageUrls.length > 1 && (
                              <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded-full">
                                +{project.imageUrls.length - 1}
                              </div>
                            )}
                          </div>
                        ) : project.imageUrl ? (
                          <div className="md:w-1/4">
                            <Image
                              src={project.imageUrl || "/placeholder.svg"}
                              alt={project.title}
                              width={200}
                              height={150}
                              className="w-full h-full object-cover aspect-video"
                            />
                          </div>
                        ) : null}
                        <div
                          className={`flex-1 p-4 ${(project.imageUrls && project.imageUrls.length > 0) || project.imageUrl
                            ? "md:w-3/4"
                            : "w-full"
                            }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-semibold">{project.title}</h3>
                              {project.subtitle && <p className="text-sm text-muted-foreground">{project.subtitle}</p>}
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>{project.timeline?.start || project.startDate}</span>
                                {(project.timeline?.end || project.endDate) && (
                                  <>
                                    <span>-</span>
                                    <span>{project.timeline?.end || project.endDate}</span>
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center">
                              {project.display ? (
                                <div className="flex items-center text-xs text-green-500 mr-2">
                                  <Eye className="h-3.5 w-3.5 mr-1" />
                                  Visible
                                </div>
                              ) : (
                                <div className="flex items-center text-xs text-muted-foreground mr-2">
                                  <EyeOff className="h-3.5 w-3.5 mr-1" />
                                  Hidden
                                </div>
                              )}
                            </div>
                          </div>

                          <p className="text-sm mt-2 line-clamp-2">{project.description}</p>

                          <div className="flex items-center mt-2">
                            <GitBranch className="h-4 w-4 mr-1" />
                            <a
                              href={project.githubLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline truncate max-w-[200px]"
                            >
                              {project.githubLink}
                            </a>
                          </div>

                          <div className="mt-2">
                            <span className="text-xs text-muted-foreground">Technologies:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {project.technologies &&
                                project.technologies.split(",").map((tech, i) => (
                                  <span
                                    key={i}
                                    className="px-2 py-0.5 bg-secondary text-secondary-foreground rounded-full text-xs"
                                  >
                                    {tech.trim()}
                                  </span>
                                ))}
                            </div>
                          </div>

                          <div className="flex gap-2 mt-4">
                            <Button variant="outline" size="sm" className="gap-1" onClick={() => handleEdit(project)}>
                              <Edit className="h-3.5 w-3.5" />
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="gap-1"
                              onClick={() => {
                                setProjectToDelete(project)
                                setDeleteDialogOpen(true)
                              }}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </TabsContent>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project
              {projectToDelete && <strong> &ldquo;{projectToDelete.title}&rdquo;</strong>} from your portfolio.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDelete(projectToDelete?.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Tabs>
  )
}
