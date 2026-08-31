import { NextResponse } from "next/server"
import { adminDb, requireAdmin } from "@/lib/firebase-admin"
import { sendPortfolioEmail } from "@/lib/email"
import { checkRateLimit } from "@/lib/rate-limit"

export const dynamic = "force-dynamic"
export const revalidate = 0

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const text = (value, max) => String(value || "").trim().slice(0, max)

export async function POST(request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
    if (!checkRateLimit(`contact:${ip}`)) return NextResponse.json({ error: "Too many messages. Please try again later." }, { status: 429 })
    const body = await request.json()
    const submission = {
      name: text(body.name, 100),
      email: text(body.email, 254).toLowerCase(),
      company: text(body.company, 150),
      subject: text(body.subject, 180) || "Portfolio contact form",
      message: text(body.message, 5000),
      timestamp: new Date().toISOString(),
      read: false,
    }
    if (!submission.name || !emailPattern.test(submission.email) || submission.message.length < 10) return NextResponse.json({ error: "Enter a valid name, email, and message" }, { status: 400 })
    const reference = await adminDb.collection("Submissions").add(submission)
    await sendPortfolioEmail({ replyTo: submission.email, subject: `Portfolio: ${submission.subject}`, text: `From: ${submission.name} <${submission.email}>\nCompany: ${submission.company || "Not provided"}\n\n${submission.message}` }).catch((error) => console.error("Contact email notification failed:", error))
    return NextResponse.json({ success: true, id: reference.id }, { status: 201, headers: { "Cache-Control": "no-store" } })
  } catch (error) {
    return NextResponse.json({ error: "Unable to send your message right now" }, { status: 500 })
  }
}

export async function GET(request) {
  try {
    await requireAdmin(request)
    const snapshot = await adminDb.collection("Submissions").orderBy("timestamp", "desc").limit(250).get()
    return NextResponse.json(
      { submissions: snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) },
      { headers: { "Cache-Control": "no-store, max-age=0" } },
    )
  } catch (error) {
    return NextResponse.json({ error: error.message || "Unable to load submissions" }, { status: error.status || 500 })
  }
}
