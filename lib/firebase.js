import { initializeApp, getApps } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getStorage, deleteObject, uploadBytes, getDownloadURL, ref, collection, addDoc, updateDoc, deleteDoc, getDocs, doc, getDoc } from "firebase/storage"
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, signInAnonymously } from "firebase/auth"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_API_KEY_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_API_KEY_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_API_KEY_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_API_KEY_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_API_KEY_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_API_KEY_MEASUREMENT_ID,
}

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

const db = getFirestore(app)
const storage = getStorage(app)
const auth = getAuth(app)

export { db, storage, auth }

export const loginWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return userCredential.user
  } catch (error) {
    console.error("Error signing in: ", error)
    throw error
  }
}

export const logoutUser = async () => {
  try {
    await signOut(auth)
  } catch (error) {
    console.error("Error signing out: ", error)
    throw error
  }
}

// Ensure authentication before accessing Firestore or Storage
export const ensureAuth = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe()
      if (user) {
        resolve(user)
      } else {
        signInAnonymously(auth).then(resolve).catch(reject)
      }
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
    
    // Get the project to retrieve image URL
    const docRef = doc(db, "projects", id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const project = docSnap.data()
      
      // Delete associated image if it exists
      if (project.imageUrl) {
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
    await ensureAuth()
    const docRef = doc(db, "projects", id)
    const docSnap = await getDoc(docRef) 
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() }
    } else {
      throw new Error("Project not found")
    }
  } catch (error) {
    console.error("Error fetching project: ", error)
    throw error
  }
}

export const getProjects = async () => {
  try {
    await ensureAuth()
    const querySnapshot = await getDocs(collection(db, "projects"))
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error("Error fetching projects: ", error)
    throw error
  }
}


export const uploadImage = async (file) => {
  try {
    await ensureAuth()
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

