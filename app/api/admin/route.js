import { NextResponse } from "next/server"
import { createOrPromoteAdmin, requireAdmin } from "@/lib/firebase-admin"

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request) {
  try {
    await requireAdmin(request)
    const { email, password, displayName } = await request.json()
    const normalizedEmail = String(email || "").trim().toLowerCase()
    if (!emailPattern.test(normalizedEmail)) return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 })
    const result = await createOrPromoteAdmin({
      email: normalizedEmail,
      password: password ? String(password) : undefined,
      displayName: String(displayName || "").trim().slice(0, 100),
    })
    return NextResponse.json({ ...result, message: result.created ? "Administrator account created" : "Existing user promoted to administrator" })
  } catch (error) {
    const message = error.code === "auth/invalid-password" ? "The password does not meet your Firebase Authentication password policy" : error.message
    const status = error.status || (error.code?.startsWith("auth/") ? 400 : 500)
    return NextResponse.json({ error: message || "Unable to create administrator" }, { status })
  }
}
