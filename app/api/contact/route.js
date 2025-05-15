import { NextResponse } from "next/server" 
import { adminDb } from "@/lib/firebase-admin"

export async function POST(request) {
  try {
    const { name, email, company, subject, message } = await request.json()

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 })
    }

    // Create a new submission in Firestore
    const submissionRef = adminDb.collection("Submissions").doc()
    await submissionRef.set({
      name,
      email,
      company: company || "",
      subject: subject || "Contact Form Submission",
      message,
      timestamp: new Date().toISOString(),
      read: false,
    })

    return NextResponse.json({
      success: true,
      id: submissionRef.id,
      message: "Submission received successfully",
    })
  } catch (error) {
    console.error("Contact API error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}

export async function GET(request) {
  try {
    // Get the authorization token from the request
    const authHeader = request.headers.get("Authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const idToken = authHeader.split("Bearer ")[1]

    // Verify the token and admin status (implementation in firebase-admin.ts)
    // This is a simplified example - you should implement proper verification

    // Get submissions from Firestore
    const submissionsRef = adminDb.collection("Submissions")
    const snapshot = await submissionsRef.orderBy("timestamp", "desc").get()

    const submissions = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    return NextResponse.json({ submissions })
  } catch (error) {
    console.error("Get submissions error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
