// 'use client'

// import { useState, useEffect, ChangeEvent } from 'react'
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Label } from "@/components/ui/label"
// import Image from 'next/image'

// // interface Project {
// //   id: number
// //   title: string
// //   description: string
// //   tech: string
// //   image: string
// //   githubLink: string
// //   demoLink: string
// // }

// export default function ProjectsPage() {
//   const [projects, setProjects] = useState([])
//   const [newProject, setNewProject] = useState({
//     id: 0,
//     title: '',
//     description: '',
//     tech: '',
//     image: '',
//     githubLink: '',
//     demoLink: ''
//   })
//   const [editingProject, setEditingProject] = useState (null)

//   useEffect(() => {
//     loadProjects()
//   }, [])

//   const loadProjects = () => {
//     const storedProjects = JSON.parse(localStorage.getItem('projects') || '[]')
//     setProjects(storedProjects)
//   }

//   const saveProjects = (updatedProjects) => {
//     localStorage.setItem('projects', JSON.stringify(updatedProjects))
//     setProjects(updatedProjects)
//     loadProjects() // Reload projects after saving
//   }

//   const handleAddProject = () => {
//     if (newProject.title && newProject.description) {
//       const updatedProjects = [...projects, { ...newProject, id: Date.now() }]
//       saveProjects(updatedProjects)
//       setNewProject({
//         id: 0,
//         title: '',
//         description: '',
//         tech: '',
//         image: '',
//         githubLink: '',
//         demoLink: ''
//       })
//     }
//   }

//   const handleEditProject = (project) => {
//     setEditingProject(project)
//   }

//   const handleUpdateProject = () => {
//     if (editingProject) {
//       const updatedProjects = projects.map(p => 
//         p.id === editingProject.id ? editingProject : p
//       )
//       saveProjects(updatedProjects)
//       setEditingProject(null)
//     }
//   }

//   const handleDeleteProject = (id) => {
//     const updatedProjects = projects.filter(p => p.id !== id)
//     saveProjects(updatedProjects)
//   }

//   const handleImageUpload = (e, isEditing) => {
//     const file = e.target.files?.[0]
//     if (file) {
//       const reader = new FileReader()
//       reader.onloadend = () => {
//         if (isEditing && editingProject) {
//           setEditingProject({ ...editingProject, image: reader.result  })
//         } else {
//           setNewProject({ ...newProject, image: reader.result  })
//         }
//       }
//       reader.readAsDataURL(file)
//     }
//   }

//   return (
//     <div className="space-y-6 p-6 bg-[#001a1a] min-h-screen text-[#00FFB2]">
//       <h2 className="text-2xl font-bold">Manage Projects</h2>
//       <div className="bg-[#002626] p-4 rounded-lg border border-[#00FFB2]/20">
//         <h3 className="text-xl font-semibold mb-4">Add New Project</h3>
//         <div className="space-y-4">
//           <div>
//             <Label htmlFor="title">Project Title</Label>
//             <Input
//               id="title"
//               placeholder="Project Title"
//               value={newProject.title}
//               onChange={(e) => setNewProject({...newProject, title: e.target.value})}
//               className="bg-[#001a1a] border-[#00FFB2]/20 text-[#00FFB2]"
//             />
//           </div>
//           <div>
//             <Label htmlFor="description">Project Description</Label>
//             <Textarea
//               id="description"
//               placeholder="Project Description"
//               value={newProject.description}
//               onChange={(e) => setNewProject({...newProject, description: e.target.value})}
//               className="bg-[#001a1a] border-[#00FFB2]/20 text-[#00FFB2]"
//             />
//           </div>
//           <div>
//             <Label htmlFor="tech">Technologies Used</Label>
//             <Input
//               id="tech"
//               placeholder="Technologies Used (e.g., React, Node.js, MongoDB)"
//               value={newProject.tech}
//               onChange={(e) => setNewProject({...newProject, tech: e.target.value})}
//               className="bg-[#001a1a] border-[#00FFB2]/20 text-[#00FFB2]"
//             />
//           </div>
//           <div>
//             <Label htmlFor="githubLink">GitHub Link</Label>
//             <Input
//               id="githubLink"
//               placeholder="GitHub Repository Link"
//               value={newProject.githubLink}
//               onChange={(e) => setNewProject({...newProject, githubLink: e.target.value})}
//               className="bg-[#001a1a] border-[#00FFB2]/20 text-[#00FFB2]"
//             />
//           </div>
//           <div>
//             <Label htmlFor="demoLink">Demo Link</Label>
//             <Input
//               id="demoLink"
//               placeholder="Live Demo Link"
//               value={newProject.demoLink}
//               onChange={(e) => setNewProject({...newProject, demoLink: e.target.value})}
//               className="bg-[#001a1a] border-[#00FFB2]/20 text-[#00FFB2]"
//             />
//           </div>
//           <div>
//             <Label htmlFor="image">Project Image</Label>
//             <Input
//               id="image"
//               type="file"
//               accept="image/*"
//               onChange={(e) => handleImageUpload(e, false)}
//               className="bg-[#001a1a] border-[#00FFB2]/20 text-[#00FFB2]"
//             />
//             {newProject.image && (
//               <div className="mt-2">
//                 <Image src={newProject.image} alt="Project preview" width={200} height={200} className="rounded-md" />
//               </div>
//             )}
//           </div>
//           <Button onClick={handleAddProject} className="bg-[#00FFB2] text-[#001a1a] hover:bg-[#00FFB2]/90">
//             Add Project
//           </Button>
//         </div>
//       </div>
//       <ScrollArea className="h-[calc(100vh-400px)]">
//         {projects.map(project => (
//           <div key={project.id} className="bg-[#002626] p-4 rounded-lg mb-4 border border-[#00FFB2]/20">
//             {editingProject && editingProject.id === project.id ? (
//               <div className="space-y-4">
//                 <Input
//                   value={editingProject.title}
//                   onChange={(e) => setEditingProject({...editingProject, title: e.target.value})}
//                   className="bg-[#001a1a] border-[#00FFB2]/20 text-[#00FFB2]"
//                 />
//                 <Textarea
//                   value={editingProject.description}
//                   onChange={(e) => setEditingProject({...editingProject, description: e.target.value})}
//                   className="bg-[#001a1a] border-[#00FFB2]/20 text-[#00FFB2]"
//                 />
//                 <Input
//                   value={editingProject.tech}
//                   onChange={(e) => setEditingProject({...editingProject, tech: e.target.value})}
//                   className="bg-[#001a1a] border-[#00FFB2]/20 text-[#00FFB2]"
//                   placeholder="Technologies Used"
//                 />
//                 <Input
//                   value={editingProject.githubLink}
//                   onChange={(e) => setEditingProject({...editingProject, githubLink: e.target.value})}
//                   className="bg-[#001a1a] border-[#00FFB2]/20 text-[#00FFB2]"
//                   placeholder="GitHub Link"
//                 />
//                 <Input
//                   value={editingProject.demoLink}
//                   onChange={(e) => setEditingProject({...editingProject, demoLink: e.target.value})}
//                   className="bg-[#001a1a] border-[#00FFB2]/20 text-[#00FFB2]"
//                   placeholder="Demo Link"
//                 />
//                 <Input
//                   type="file"
//                   accept="image/*"
//                   onChange={(e) => handleImageUpload(e, true)}
//                   className="bg-[#001a1a] border-[#00FFB2]/20 text-[#00FFB2]"
//                 />
//                 {editingProject.image && (
//                   <div className="mt-2">
//                     <Image src={editingProject.image} alt="Project preview" width={200} height={200} className="rounded-md" />
//                   </div>
//                 )}
//                 <Button onClick={handleUpdateProject} className="bg-[#00FFB2] text-[#001a1a] hover:bg-[#00FFB2]/90 mr-2">
//                   Save
//                 </Button>
//                 <Button onClick={() => setEditingProject(null)} className="bg-gray-500 text-white hover:bg-gray-600">
//                   Cancel
//                 </Button>
//               </div>
//             ) : (
//               <>
//                 <h3 className="text-xl font-semibold">{project.title}</h3>
//                 <p className="text-[#00FFB2]/70 my-2">{project.description}</p>
//                 <p className="text-[#00FFB2]/70 my-2">Tech: {project.tech}</p>
//                 {project.image && (
//                   <div className="my-2">
//                     <Image src={project.image} alt={project.title} width={200} height={200} className="rounded-md" />
//                   </div>
//                 )}
//                 {project.githubLink && (
//                   <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="text-[#00FFB2] underline block">
//                     GitHub Repository
//                   </a>
//                 )}
//                 {project.demoLink && (
//                   <a href={project.demoLink} target="_blank" rel="noopener noreferrer" className="text-[#00FFB2] underline block">
//                     Live Demo
//                   </a>
//                 )}
//                 <div className="mt-4">
//                   <Button onClick={() => handleEditProject(project)} className="bg-[#00FFB2] text-[#001a1a] hover:bg-[#00FFB2]/90 mr-2">
//                     Edit
//                   </Button>
//                   <Button onClick={() => handleDeleteProject(project.id)} className="bg-red-500 text-white hover:bg-red-600">
//                     Delete
//                   </Button>
//                 </div>
//               </>
//             )}
//           </div>
//         ))}
//       </ScrollArea>
//     </div>
//   )
// }

