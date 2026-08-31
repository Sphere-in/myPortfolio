import { NextResponse } from "next/server"
import { adminDb, requireAdmin } from "@/lib/firebase-admin"
import { sanitizeProject } from "@/lib/project-data"

export async function POST(request) {
  try {
    const admin = await requireAdmin(request)
    const project = sanitizeProject(await request.json())
    const duplicate = await adminDb.collection("projects").where("slug", "==", project.slug).limit(1).get()
    if (!duplicate.empty) return NextResponse.json({ error: "That project slug is already in use" }, { status: 409 })
    const timestamp = new Date().toISOString()
    const reference = await adminDb.collection("projects").add({ ...project, timestamp, updatedAt: timestamp, updatedBy: admin.uid })
    return NextResponse.json({ id: reference.id })
  } catch (error) {
    return NextResponse.json({ error: error.message || "Unable to save project" }, { status: error.status || 500 })
  }
}
