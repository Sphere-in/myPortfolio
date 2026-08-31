import { NextResponse } from "next/server"
import { adminDb, requireAdmin } from "@/lib/firebase-admin"
import { DEFAULT_ABOUT_CONTENT } from "@/data/about-defaults"

const aboutRef = () => adminDb.collection("siteContent").doc("about")
const cleanText = (value, fallback, max) => typeof value === "string" ? value.trim().slice(0, max) : fallback

export async function GET() {
  try {
    const snapshot = await aboutRef().get()
    const content = snapshot.exists ? { ...DEFAULT_ABOUT_CONTENT, ...snapshot.data() } : DEFAULT_ABOUT_CONTENT
    return NextResponse.json({ content }, { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } })
  } catch {
    return NextResponse.json({ content: DEFAULT_ABOUT_CONTENT })
  }
}

export async function PATCH(request) {
  try {
    const admin = await requireAdmin(request)
    const body = await request.json()
    const content = {
      eyebrow: cleanText(body.eyebrow, DEFAULT_ABOUT_CONTENT.eyebrow, 60),
      name: cleanText(body.name, DEFAULT_ABOUT_CONTENT.name, 100),
      role: cleanText(body.role, DEFAULT_ABOUT_CONTENT.role, 120),
      description: cleanText(body.description, DEFAULT_ABOUT_CONTENT.description, 5000),
      imageUrl: cleanText(body.imageUrl, DEFAULT_ABOUT_CONTENT.imageUrl, 2000),
      imageAlt: cleanText(body.imageAlt, DEFAULT_ABOUT_CONTENT.imageAlt, 160),
      imageVisible: body.imageVisible !== false,
      updatedAt: new Date().toISOString(),
      updatedBy: admin.uid,
    }
    await aboutRef().set(content, { merge: true })
    return NextResponse.json({ content })
  } catch (error) {
    return NextResponse.json({ error: error.message || "Unable to update About content" }, { status: error.status || 500 })
  }
}
