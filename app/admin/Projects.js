"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { saveProject, updateProject, deleteProject, getProjects, uploadImage, ensureAuth } from "@/lib/firebase"
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
import { Edit, Trash2, Save, Plus, Calendar, Github, Code, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"

export default function Projects() {
  const [projectData, setProjectData] = useState({
    title: "",
    description: "",
    githubLink: "",
    technologies: "",
    startDate: "",
    endDate: "",
    imageUrl: "",
    display: true,
  })
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const initAuth = async () => {
      try {
        await ensureAuth()
        fetchProjects()
      } catch (error) {
        console.error("Error initializing auth:", error)
        setError("Failed to authenticate. Please try again.")
        toast.error("Authentication failed. Please log in again.")
      }
    }
    initAuth()
  }, [])

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
    const { name, value, type, checked } = e.target
    setProjectData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
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
        toast.success("Image uploaded successfully")
      } catch (error) {
        console.error("Error uploading image:", error)
        setError(error.message)
        setUploadProgress(0)
        toast.error("Failed to upload image")
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
        toast.success("Project updated successfully")
      } else {
        await saveProject(projectData)
        toast.success("Project saved successfully")
      }

      setProjectData({
        title: "",
        description: "",
        githubLink: "",
        technologies: "",
        startDate: "",
        endDate: "",
        imageUrl: "",
        display: true,
      })
      setEditingId(null)
      fetchProjects()
      router.refresh()
    } catch (error) {
      console.error("Error saving project:", error)
      setError(error.message)
      toast.error(editingId ? "Failed to update project" : "Failed to save project")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (project) => {
    setProjectData(project)
    setEditingId(project.id)
    toast.info("Editing project: " + project.title)
  }

  const handleDelete = async (id) => {
    try {
      await deleteProject(id)
      toast.success("Project deleted successfully")
      fetchProjects()
      setDeleteDialogOpen(false)
    } catch (error) {
      console.error("Error deleting project:", error)
      setError(error.message)
      toast.error("Failed to delete project")
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
    <Tabs defaultValue="form" className="h-full">
      <TabsList className="mb-4">
        <TabsTrigger value="form" className="gap-2">
          {editingId ? <Edit className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {editingId ? "Edit Project" : "New Project"}
        </TabsTrigger>
        <TabsTrigger value="list" className="gap-2">
          <Code className="h-4 w-4" />
          Project List
        </TabsTrigger>
      </TabsList>

      <TabsContent value="form" className="h-[calc(100%-40px)]">
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit Project" : "Add New Project"}</CardTitle>
            <CardDescription>
              {editingId
                ? "Update the details of your existing project"
                : "Fill in the details to add a new project to your portfolio"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form id="projectForm" onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Project Title</Label>
                  <Input id="title" name="title" value={projectData.title} onChange={handleChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="githubLink">GitHub Link</Label>
                  <Input
                    id="githubLink"
                    name="githubLink"
                    type="url"
                    value={projectData.githubLink}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Project Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={projectData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="technologies">Technologies Used</Label>
                <Input
                  id="technologies"
                  name="technologies"
                  value={projectData.technologies}
                  onChange={handleChange}
                  required
                  placeholder="React, Node.js, MongoDB, etc."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={projectData.startDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input id="endDate" name="endDate" type="date" value={projectData.endDate} onChange={handleChange} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Project Image</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="image"
                    name="image"
                    type="file"
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="flex-1"
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

              {projectData.imageUrl && (
                <div className="border rounded-md p-2 inline-block">
                  <Image
                    src={projectData.imageUrl || "/placeholder.svg"}
                    alt="Project Preview"
                    width={200}
                    height={150}
                    className="object-cover rounded"
                  />
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
            </form>
          </CardContent>
          <CardFooter className="flex justify-end">
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

      <TabsContent value="list" className="h-[calc(100%-40px)]">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Project List</CardTitle>
            <CardDescription>Manage your portfolio projects</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-270px)]">
              {projects.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No projects found. Add your first project using the form.
                </div>
              ) : (
                <div className="space-y-4">
                  {projects.map((project) => (
                    <Card key={project.id} className="overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        {project.imageUrl && (
                          <div className="md:w-1/4">
                            <Image
                              src={project.imageUrl || "/placeholder.svg"}
                              alt={project.title}
                              width={200}
                              height={150}
                              className="w-full h-full object-cover aspect-video"
                            />
                          </div>
                        )}
                        <div className={`flex-1 p-4 ${project.imageUrl ? "md:w-3/4" : "w-full"}`}>
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-semibold">{project.title}</h3>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>{project.startDate}</span>
                                {project.endDate && (
                                  <>
                                    <span>-</span>
                                    <span>{project.endDate}</span>
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
                            <Github className="h-4 w-4 mr-1" />
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
                              {project.technologies.split(",").map((tech, i) => (
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
              {projectToDelete && <strong> "{projectToDelete.title}"</strong>} from your portfolio.
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
