"use client"

import { initializeApp, getApps } from "firebase/app"
import {  query, where, } from "firebase/firestore"
import { getFirestore } from "firebase/firestore"
import { getStorage, deleteObject } from "firebase/storage"
import { getDoc } from "firebase/firestore"
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, signInAnonymously } from "firebase/auth"
import { collection, addDoc, updateDoc, deleteDoc, getDocs, doc, orderBy } from "firebase/firestore"
import { uploadBytes, getDownloadURL, ref } from "firebase/storage"
import { DEFAULT_ABOUT_CONTENT } from "@/data/about-defaults"

// Your Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_API_KEY_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_API_KEY_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_API_KEY_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_API_KEY_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_API_KEY_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_API_KEY_MEASUREMENT_ID,
}

// Initialize Firebase
let app
if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig)
  } catch (error) {
    console.error("Error initializing app: ", error)
  }
} else {
  app = getApps()[0]
}

// Initialize services
const db = getFirestore(app)
const storage = getStorage(app)
const auth = getAuth(app)

export { db, storage, auth }

// Helper functions for client-side
export const loginWithEmailAndPassword = async (email, password) => {
  try {
    const { signInWithEmailAndPassword } = await import("firebase/auth")
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return userCredential.user
  } catch (error) {
    console.error("Error signing in: ", error)
    throw error
  }
}

export const logoutUser = async () => {
  try {
    const { signOut } = await import("firebase/auth")
    await signOut(auth)
  } catch (error) {
    console.error("Error signing out: ", error)
    throw error
  }
}

// Ensure authentication before accessing Firestore or Storage
export const ensureAuth = () => {
  return new Promise((resolve, reject) => {
    const { onAuthStateChanged, signInAnonymously } = require("firebase/auth")
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe()
      if (user) {
        resolve(user)
      } else {
        throw new Error("Anonymous access not allowed")      }
    })
  })
}


export const saveProject = async (projectData) => {
  try {
    const user = await ensureAuth()
    const docRef = await addDoc(collection(db, "projects"), {
      ...projectData,
      userId: user.uid,
      timestamp: new Date().toISOString(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error saving project: ", error)
    throw error
  }
}

export const updateProject = async (id, projectData) => {
  try {
    await ensureAuth()
    const projectRef = doc(db, "projects", id)
    await updateDoc(projectRef, projectData)
  } catch (error) {
    console.error("Error updating project: ", error)
    throw error
  }
}

export const deleteProject = async (id) => {
  try {
    await ensureAuth()

    // Get the project to retrieve image URLs
    const docRef = doc(db, "projects", id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const project = docSnap.data()

      // Delete associated images if they exist
      if (project.imageUrls && project.imageUrls.length > 0) {
        const deletePromises = project.imageUrls.map((url) => deleteImage(url))
        await Promise.all(deletePromises)
      } else if (project.imageUrl) {
        // For backward compatibility with old projects
        await deleteImage(project.imageUrl)
      }
    }

    // Delete the project document
    await deleteDoc(docRef)
  } catch (error) {
    console.error("Error deleting project: ", error)
    throw error
  }
}

export const getProjectById = async (id) => {
  try {
    // await ensureAuth()
    const docRef = doc(db, "projects", id)
    const docSnap = await getDoc(docRef) // Changed getDocs to getDoc

    if (docSnap.exists()) {
      const project = { id: docSnap.id, ...docSnap.data() }
      if (project.display === false) throw new Error("Project not found")
      return project
    } else {
      throw new Error("Project not found")
    }
  } catch (error) {
    console.error("Error fetching project: ", error)
    throw error
  }
}

export const getProjectBySlug = async (slug) => {
  try {
    // await ensureAuth()

    const q = query(collection(db, "projects"), where("slug", "==", slug))
    const querySnapshot = await getDocs(q)

    if (!querySnapshot.empty) {
      const docSnap = querySnapshot.docs[0]
      const project = { id: docSnap.id, ...docSnap.data() }
      if (project.display === false) throw new Error("Project not found")
      return project
    } else {
      throw new Error("Project not found")
    }
  } catch (error) {
    console.error("Error fetching project by slug: ", error)
    throw error
  }
}

export const getProjects = async () => {
  try {
    const q = query(collection(db, "projects"), orderBy("position", "desc"))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error("Error fetching projects: ", error)
    throw error
  }
}

export const getAboutContent = async () => {
  const snapshot = await getDoc(doc(db, "siteContent", "about"))
  return snapshot.exists() ? { ...DEFAULT_ABOUT_CONTENT, ...snapshot.data() } : DEFAULT_ABOUT_CONTENT
}

export const uploadImage = async (file) => {
  try {
    // await ensureAuth()
    const storageRef = ref(storage, `project-images/${Date.now()}_${file.name}`)
    const snapshot = await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(snapshot.ref)
    return downloadURL
  } catch (error) {
    console.error("Error uploading image: ", error)
    throw error
  }
}

export const deleteImage = async (imageUrl) => {
  try {
    const imagePath = new URL(imageUrl).pathname.split("/o/")[1].split("?")[0]
    const decodedPath = decodeURIComponent(imagePath)
    const imageRef = ref(storage, decodedPath)
    await deleteObject(imageRef)
  } catch (error) {
    console.error("Error deleting image: ", error)
    throw error
  }
}

export const deleteSingleImage = async (imageUrl) => {
  try {
    await ensureAuth()
    await deleteImage(imageUrl)
    return true
  } catch (error) {
    console.error("Error deleting single image: ", error)
    throw error
  }
}
