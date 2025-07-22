import { initializeApp, cert } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
require("dotenv").config()

// Initialize Firebase Admin SDK using the service account JSON file
import serviceAccount from "../admin.json"
const app = initializeApp({
  credential: cert(serviceAccount),
})

const auth = getAuth(app)

async function createFirstAdmin() {
  try {
    const email = "raihanshk@gmail.com"
    const user = await auth.getUserByEmail(email)
    await auth.setCustomUserClaims(user.uid, { admin: true })
    console.log(`Admin privileges granted to ${email}`)
    process.exit(0)
  } catch (error) {
    console.error("Error creating admin:", error)
    process.exit(1)
  }
}

createFirstAdmin()
