import { NextResponse } from "next/server"
import { adminDb, requireAdmin } from "@/lib/firebase-admin"

export async function DELETE(request, context) {
  try {
    await requireAdmin(request)
    const { id } = await context.params
    await adminDb.collection("Submissions").doc(id).delete()
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error.message || "Unable to delete submission" }, { status: error.status || 500 })
  }
}

export async function PATCH(request, context) {
  try {
    await requireAdmin(request)
    const { id } = await context.params
    const { read } = await request.json()
    await adminDb.collection("Submissions").doc(id).update({ read: read === true })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error.message || "Unable to update submission" }, { status: error.status || 500 })
  }
}
