import "server-only"

import { applicationDefault, cert, getApps, initializeApp } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"
import { getStorage } from "firebase-admin/storage"
import credentialLoader from "./firebase-credentials.cjs"

const { getServiceAccount } = credentialLoader

function getCredential() {
  const encodedCredentials = process.env.ADMIN_CREDENTIALS_BASE64
  if (!encodedCredentials) return applicationDefault()
  return cert(getServiceAccount())
}

let services

function getServices() {
  if (services) return services
  const adminApp = getApps()[0] || initializeApp({
    credential: getCredential(),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_API_KEY_STORAGE_BUCKET,
  })
  services = { auth: getAuth(adminApp), db: getFirestore(adminApp), storage: getStorage(adminApp) }
  return services
}

function lazyService(key) {
  return new Proxy({}, {
    get(_target, property) {
      const service = getServices()[key]
      const value = service[property]
      return typeof value === "function" ? value.bind(service) : value
    },
  })
}

const adminAuth = lazyService("auth")
const adminDb = lazyService("db")
const adminStorage = lazyService("storage")

export async function verifyAdminUser(idToken) {
  if (!idToken || typeof idToken !== "string") return false
  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken, true)
    if (decodedToken.admin === true) return true
    const user = await adminAuth.getUser(decodedToken.uid)
    return user.customClaims?.admin === true
  } catch {
    return false
  }
}

export async function requireAdmin(request) {
  const authorization = request.headers.get("authorization") || ""
  if (!authorization.startsWith("Bearer ")) {
    const error = new Error("Authentication required")
    error.status = 401
    throw error
  }

  const idToken = authorization.slice(7)
  const decodedToken = await adminAuth.verifyIdToken(idToken, true)
  const user = await adminAuth.getUser(decodedToken.uid)
  if (user.disabled || user.customClaims?.admin !== true) {
    const error = new Error("Administrator permission required")
    error.status = 403
    throw error
  }
  return user
}

export async function createOrPromoteAdmin({ email, password, displayName }) {
  let user
  let created = false
  try {
    user = await adminAuth.getUserByEmail(email)
  } catch (error) {
    if (error.code !== "auth/user-not-found") throw error
    if (!password || password.length < 6) {
      const passwordError = new Error("A password of at least 6 characters is required when creating a new user")
      passwordError.status = 400
      throw passwordError
    }
    user = await adminAuth.createUser({ email, password, displayName: displayName || undefined, emailVerified: false })
    created = true
  }

  await adminAuth.setCustomUserClaims(user.uid, { ...(user.customClaims || {}), admin: true })
  return { uid: user.uid, email: user.email, created }
}

export { adminAuth, adminDb, adminStorage }
