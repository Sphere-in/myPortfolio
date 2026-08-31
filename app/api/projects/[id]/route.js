import { NextResponse } from "next/server"
import { adminDb, adminStorage, requireAdmin } from "@/lib/firebase-admin"
import { sanitizeProject } from "@/lib/project-data"

function storagePathFromUrl(url) {
  try {
    const encodedPath = new URL(url).pathname.split("/o/")[1]
    const path = encodedPath ? decodeURIComponent(encodedPath) : null
    return path?.startsWith("project-images/") ? path : null
  } catch {
    return null
  }
}

async function removeStoredImages(urls) {
  await Promise.allSettled(urls.map((url) => {
    const path = storagePathFromUrl(url)
    return path ? adminStorage.bucket().file(path).delete({ ignoreNotFound: true }) : Promise.resolve()
  }))
}

export async function PATCH(request, context) {
  try {
    const admin = await requireAdmin(request)
    const { id } = await context.params
    const reference = adminDb.collection("projects").doc(id)
    const snapshot = await reference.get()
    if (!snapshot.exists) return NextResponse.json({ error: "Project not found" }, { status: 404 })
    const project = sanitizeProject(await request.json())
    const duplicate = await adminDb.collection("projects").where("slug", "==", project.slug).limit(2).get()
    if (duplicate.docs.some((doc) => doc.id !== id)) return NextResponse.json({ error: "That project slug is already in use" }, { status: 409 })
    const oldImages = snapshot.data().imageUrls || (snapshot.data().imageUrl ? [snapshot.data().imageUrl] : [])
    await reference.update({ ...project, updatedAt: new Date().toISOString(), updatedBy: admin.uid })
    await removeStoredImages(oldImages.filter((url) => !project.imageUrls.includes(url)))
    return NextResponse.json({ id })
  } catch (error) {
    return NextResponse.json({ error: error.message || "Unable to update project" }, { status: error.status || 500 })
  }
}

export async function DELETE(request, context) {
  try {
    await requireAdmin(request)
    const { id } = await context.params
    const reference = adminDb.collection("projects").doc(id)
    const snapshot = await reference.get()
    if (!snapshot.exists) return NextResponse.json({ error: "Project not found" }, { status: 404 })
    const data = snapshot.data()
    const images = data.imageUrls || (data.imageUrl ? [data.imageUrl] : [])
    await reference.delete()
    await removeStoredImages(images)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error.message || "Unable to delete project" }, { status: error.status || 500 })
  }
}
