import { adminAuth, verifyAdminUser, setAdminClaim } from "@/lib/firebase-admin"
import { NextResponse } from "next/server"
export async function POST(request) {
  try {
    const { action, email, idToken } = await request.json()

    if (!idToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify the ID token
    const decodedToken = await adminAuth.verifyIdToken(idToken)
    const uid = decodedToken.uid

    // Check if the user is an admin
    const isAdmin = await verifyAdminUser(uid)

    if (!isAdmin) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    // Handle different admin actions
    switch (action) {
      case "setAdmin":
        if (!email) {
          return NextResponse.json({ error: "Email is required" }, { status: 400 })
        }

        const success = await setAdminClaim(email)

        if (success) {
          return NextResponse.json({ success: true, message: "Admin privileges granted" })
        } else {
          return NextResponse.json({ error: "Failed to set admin claim" }, { status: 500 })
        }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Admin API error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
