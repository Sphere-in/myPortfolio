import { NextResponse } from "next/server"
import { adminDb, adminAuth, verifyAdminUser } from "@/lib/firebase-admin"

export async function DELETE(request, { params }) {
  try {
    const id = params.id
    const authHeader = request.headers.get("Authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const idToken = authHeader.split("Bearer ")[1]

    // Verify the token
    const decodedToken = await adminAuth.verifyIdToken(idToken)
    const uid = decodedToken.uid

    // Check if the user is an admin
    const isAdmin = await verifyAdminUser(uid)

    if (!isAdmin) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    // Delete the submission
    await adminDb.collection("Submissions").doc(id).delete()

    return NextResponse.json({ success: true, message: "Submission deleted successfully" })
  } catch (error) {
    console.error("Delete submission error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request, { params }) {
  try {
    const id = params.id
    const { read } = await request.json()
    const authHeader = request.headers.get("Authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const idToken = authHeader.split("Bearer ")[1]

    // Verify the token
    const decodedToken = await adminAuth.verifyIdToken(idToken)
    const uid = decodedToken.uid

    // Check if the user is an admin
    const isAdmin = await verifyAdminUser(uid)

    if (!isAdmin) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    // Update the submission
    await adminDb
      .collection("Submissions")
      .doc(id)
      .update({
        read: read === true,
      })

    return NextResponse.json({ success: true, message: "Submission updated successfully" })
  } catch (error) {
    console.error("Update submission error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
