import { randomUUID } from "node:crypto"
import { NextResponse } from "next/server"
import { adminStorage, requireAdmin } from "@/lib/firebase-admin"

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"])
const allowedFolders = new Set(["project-images", "about-images"])

export async function POST(request) {
  try {
    await requireAdmin(request)
    const formData = await request.formData()
    const file = formData.get("file")
    const requestedFolder = String(formData.get("folder") || "project-images")
    const folder = allowedFolders.has(requestedFolder) ? requestedFolder : "project-images"
    if (!file || typeof file.arrayBuffer !== "function") return NextResponse.json({ error: "Choose an image to upload" }, { status: 400 })
    if (!allowedTypes.has(file.type)) return NextResponse.json({ error: "Only JPG, PNG, WebP, and GIF images are supported" }, { status: 415 })
    if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: "Images must be 5 MB or smaller" }, { status: 413 })

    const token = randomUUID()
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(-120)
    const objectName = `${folder}/${Date.now()}-${randomUUID()}-${safeName}`
    const bucket = adminStorage.bucket()
    await bucket.file(objectName).save(Buffer.from(await file.arrayBuffer()), {
      contentType: file.type,
      resumable: false,
      metadata: { cacheControl: "public,max-age=31536000,immutable", metadata: { firebaseStorageDownloadTokens: token } },
    })
    const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(objectName)}?alt=media&token=${token}`
    return NextResponse.json({ url })
  } catch (error) {
    return NextResponse.json({ error: error.message || "Image upload failed" }, { status: error.status || 500 })
  }
}
