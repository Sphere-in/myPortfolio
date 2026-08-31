const { cert, getApps, initializeApp } = require("firebase-admin/app")
const { getAuth } = require("firebase-admin/auth")
const { getServiceAccount } = require("../lib/firebase-credentials.cjs")
require("dotenv").config({ quiet: true })
async function createFirstAdmin() {
  const email = process.env.INITIAL_ADMIN_EMAIL
  if (!email) throw new Error("Set INITIAL_ADMIN_EMAIL before running this script")
  const serviceAccount = getServiceAccount()
  const app = getApps()[0] || initializeApp({ credential: cert(serviceAccount) })
  const auth = getAuth(app)
  let user
  let created = false
  try {
    user = await auth.getUserByEmail(email)
  } catch (error) {
    if (error.code !== "auth/user-not-found") throw error
    const password = process.env.INITIAL_ADMIN_PASSWORD
    if (!password || password.length < 12) {
      throw new Error("No Firebase Authentication user exists for INITIAL_ADMIN_EMAIL. Set INITIAL_ADMIN_PASSWORD to at least 12 characters, then run this command again.")
    }
    user = await auth.createUser({ email, password, emailVerified: false })
    created = true
  }
  await auth.setCustomUserClaims(user.uid, { ...(user.customClaims || {}), admin: true })
  console.log(created ? `Admin account created for ${email}` : `Admin access granted to ${email}`)
}

createFirstAdmin().catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})
