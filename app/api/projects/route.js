import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request) {
  try {
    const projectData = await request.json()
    const filePath = path.join(process.cwd(), 'data', 'projects.json')

    // Ensure the data directory exists
    await fs.mkdir(path.dirname(filePath), { recursive: true })

    // Read existing projects
    let projects = []
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8')
      projects = JSON.parse(fileContent)

      // Ensure the content is an array
      if (!Array.isArray(projects)) {
        console.warn('projects.json does not contain an array. Resetting to empty array.')
        projects = []
      }
    } catch (error) {
      // If file doesn't exist or is empty, start with an empty array
      console.log('No existing projects file, starting with an empty array')
    }

    // Add new project with ID and display property
    const newProject = {
      id: uuidv4(),
      ...projectData,
      display: projectData.display ?? true, // Default to true if not provided
    }
    projects.push(newProject)

    // Write updated projects back to file
    await fs.writeFile(filePath, JSON.stringify(projects, null, 2))

    return NextResponse.json({ message: 'Project saved successfully', project: newProject }, { status: 200 })
  } catch (error) {
    console.error('Error saving project:', error)
    return NextResponse.json({ message: 'Error saving project: ' + error.message }, { status: 500 })
  }
}

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'projects.json')
    const fileContent = await fs.readFile(filePath, 'utf-8')
    const projects = JSON.parse(fileContent)
    return NextResponse.json(projects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json({ message: 'Error fetching projects: ' + error.message }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const { id, ...updatedData } = await request.json()
    const filePath = path.join(process.cwd(), 'data', 'projects.json')
    const fileContent = await fs.readFile(filePath, 'utf-8')
    let projects = JSON.parse(fileContent)
    
    const index = projects.findIndex(project => project.id === id)
    if (index !== -1) {
      projects[index] = { 
        ...projects[index], 
        ...updatedData,
        display: updatedData.display ?? projects[index].display // Preserve existing value if not provided
      }
      await fs.writeFile(filePath, JSON.stringify(projects, null, 2))
      return NextResponse.json({ message: 'Project updated successfully', project: projects[index] })
    } else {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 })
    }
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json({ message: 'Error updating project: ' + error.message }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json()
    const filePath = path.join(process.cwd(), 'data', 'projects.json')
    const fileContent = await fs.readFile(filePath, 'utf-8')
    let projects = JSON.parse(fileContent)
    
    const filteredProjects = projects.filter(project => project.id !== id)
    if (filteredProjects.length < projects.length) {
      await fs.writeFile(filePath, JSON.stringify(filteredProjects, null, 2))
      return NextResponse.json({ message: 'Project deleted successfully' })
    } else {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 })
    }
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json({ message: 'Error deleting project: ' + error.message }, { status: 500 })
  }
}

