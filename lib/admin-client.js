import { auth } from "@/lib/firebase"

export async function adminFetch(url, options = {}) {
  const user = auth.currentUser
  if (!user) throw new Error("Your admin session has expired. Please sign in again.")
  const idToken = await user.getIdToken()
  const headers = new Headers(options.headers)
  headers.set("Authorization", `Bearer ${idToken}`)
  if (options.body && !(options.body instanceof FormData) && !headers.has("Content-Type")) headers.set("Content-Type", "application/json")

  const response = await fetch(url, { ...options, headers })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.error || "The request could not be completed")
  return data
}

export async function uploadAdminImage(file, folder = "project-images") {
  const formData = new FormData()
  formData.set("file", file)
  formData.set("folder", folder)
  const { url } = await adminFetch("/api/uploads", { method: "POST", body: formData })
  return url
}
