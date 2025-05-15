// const { initializeApp, cert } = require("firebase-admin/app")
// const { getAuth } = require("firebase-admin/auth")
// require("dotenv").config()

// // Initialize Firebase Admin SDK using the service account JSON file
// const serviceAccount = require("../admin.json")
// const app = initializeApp({
//   credential: cert(serviceAccount),
// })

// const auth = getAuth(app)

// async function createFirstAdmin() {
// //   if (!process.env.ADMIN_EMAIL) {
// //     console.error("ADMIN_EMAIL environment variable is required")
// //     process.exit(1)
// //   }

//   try {
//     // Get the user by email
//     // const email = process.env.ADMIN_EMAIL
//     const email = "raihanshk@gmail.com"
//     const user = await auth.getUserByEmail(email)

//     // Set custom claims
//     await auth.setCustomUserClaims(user.uid, { admin: true })

//     console.log(`Admin privileges granted to ${email}`)
//     process.exit(0)
//   } catch (error) {
//     console.error("Error creating admin:", error)
//     process.exit(1)
//   }
// }

// createFirstAdmin()
