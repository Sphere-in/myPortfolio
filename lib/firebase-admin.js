import { initializeApp, cert, getApps } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"
import { getStorage } from "firebase-admin/storage"

// Initialize Firebase Admin SDK
function initAdmin() {
  const apps = getApps()

  if (!apps.length) {
    try {
      // const serviceAccount = require("../admin.json")
      const serviceAccount = JSON.parse(
        Buffer.from(process.env.ADMIN_CREDENTIALS_BASE64, 'base64').toString('utf-8')
      );
      
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
export async function verifyAdminUser(token) {
  try {
    const decodedToken = await adminAuth.verifyIdToken(token)
    const uid = decodedToken.uid
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


// export const imageUpload = async (file) => {
//   try {
//     // await verifyAdminUser(uid)
//     const storageRef = ref(storage, `project-images/${Date.now()}_${file.name}`)
//     const snapshot = await uploadBytes(storageRef, file)
//     const downloadURL = await getDownloadURL(snapshot.ref)
//     return downloadURL
//   } catch (error) {
//     console.error("Error uploading image: ", error)
//     throw error
//   }
// }

export { adminAuth, adminDb, adminStorage }
