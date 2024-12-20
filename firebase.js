import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAQeK0m75MT17b2Z9qF2WJQ03XAkOJiN_g",

    // apiKey: process.env.API_KEY,
    authDomain: "portfolio-7d2ad.firebaseapp.com",
    projectId: "portfolio-7d2ad",
    storageBucket: "portfolio-7d2ad.firebasestorage.app",
    messagingSenderId: "18538077113",
    appId: "1:18538077113:web:51b71e26c2106aee017468",
    measurementId: "G-4N5L8H2MHF"
    // authDomain: "portfolio-7d2ad.firebaseapp.com",
    // projectId: "portfolio-7d2ad",
    // storageBucket: "portfolio-7d2ad.firebasestorage.app",
    // messagingSenderId: "18538077113",
    // appId: "1:18538077113:web:51b71e26c2106aee017468",
    // measurementId: "G-4N5L8H2MHF"
  };

  let app;
  if (!getApps().length) {
    try {
      app = initializeApp(firebaseConfig);
    } catch (error) {
      console.error("Error initializing app: ", error);
    }
  } else {
    app = getApps()[0];
  }
  
  const db = getFirestore(app);
  const storage = getStorage(app);
  const auth = getAuth(app);
  
  export { db, storage, auth };
  
  // Ensure authentication before accessing Firestore or Storage
  export const ensureAuth = () => {
    return new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe();
        if (user) {
          resolve(user);
        } else {
          signInAnonymously(auth).then(resolve).catch(reject);
        }
      });
    });
  };
  
  export const saveProject = async (projectData) => {
    try {
      const user = await ensureAuth();
      const docRef = await addDoc(collection(db, "projects"), {
        ...projectData,
        userId: user.uid,
        timestamp: new Date().toISOString(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error saving project: ", error);
      throw error;
    }
  };
  
  export const updateProject = async (id, projectData) => {
    try {
      await ensureAuth();
      const projectRef = doc(db, "projects", id);
      await updateDoc(projectRef, projectData);
    } catch (error) {
      console.error("Error updating project: ", error);
      throw error;
    }
  };
  
  export const deleteProject = async (id) => {
    try {
      await ensureAuth();
      await deleteDoc(doc(db, "projects", id));
    } catch (error) {
      console.error("Error deleting project: ", error);
      throw error;
    }
  };
  
  export const getProjects = async () => {
    try {
      await ensureAuth();
      const querySnapshot = await getDocs(collection(db, "projects"));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error fetching projects: ", error);
      throw error;
    }
  };
  
  export const uploadImage = async (file) => {
    try {
      await ensureAuth();
      const storageRef = ref(storage, `project-images/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image: ", error);
      throw error;
    }
  };
  
  