import { initializeApp, cert, getApps } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"
import { getStorage } from "firebase-admin/storage"

// Initialize Firebase Admin SDK
function initAdmin() {
  const apps = getApps()

  if (!apps.length) {
    try {
      // Import the service account JSON file directly
      // Note: Make sure admin.json is in a secure location and not exposed to the client
      // const serviceAccount = require("../admin.json")
      const serviceAccount = {
        type: process.env.TYPE,
        project_id: process.env.PROJECT_ID,
        private_key_id: process.env.PRIVATE_KEY,
        private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'), // Replace literal \n with actual newlines
        client_email: process.env.CLIENT_EMAIL,
        client_id: process.env.CLIENT_ID,
        auth_uri: process.env.AUTH_URI,
        token_uri: process.env.TOKEN_URI,
        auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
        client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
        universe_domain: process.env.UNIVERSE_DOMAIN,
      }

      return initializeApp({
        credential: cert(serviceAccount),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_API_KEY_STORAGE_BUCKET,
      })
    } catch (error) {
      console.error("Error initializing Firebase Admin:", error)
      throw error
    }
  }

  return apps[0]
}

// Initialize services
const app = initAdmin()
const adminAuth = getAuth(app)
const adminDb = getFirestore(app)
const adminStorage = getStorage(app)

// Admin functions
export async function verifyAdminUser(uid) {
  try {
    const user = await adminAuth.getUser(uid)
    const customClaims = user.customClaims || {}
    return customClaims.admin === true
  } catch (error) {
    console.error("Error verifying admin user:", error)
    return false
  }
}

export async function setAdminClaim(email) {
  try {
    const user = await adminAuth.getUserByEmail(email)
    await adminAuth.setCustomUserClaims(user.uid, { admin: true })
    return true
  } catch (error) {
    console.error("Error setting admin claim:", error)
    return false
  }
}

export async function getSubmissions() {
  try {
    const submissionsRef = adminDb.collection("Submissions")
    const snapshot = await submissionsRef.orderBy("timestamp", "desc").get()

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error("Error getting submissions:", error)
    throw error
  }
}

export async function deleteSubmission(id) {
  try {
    await adminDb.collection("Submissions").doc(id).delete()
    return true
  } catch (error) {
    console.error("Error deleting submission:", error)
    throw error
  }
}

export { adminAuth, adminDb, adminStorage }
