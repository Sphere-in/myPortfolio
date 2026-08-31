import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/firebase-admin"
import { sendPortfolioEmail } from "@/lib/email"

export async function POST(request) {
  try {
    const admin = await requireAdmin(request)
    const { subject, message, to } = await request.json()
    const recipient = String(to || "").trim().slice(0, 254)
    const body = String(message || "").trim().slice(0, 10000)
    if (!recipient || !body) return NextResponse.json({ error: "Recipient and message are required" }, { status: 400 })
    await sendPortfolioEmail({ to: recipient, replyTo: admin.email, subject: String(subject || "Portfolio reply").slice(0, 180), text: body })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error.message || "Unable to send email" }, { status: error.status || 500 })
  }
}
