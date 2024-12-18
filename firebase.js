import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Firebase Authentication

const firebaseConfig = {
    apiKey: "AIzaSyAQeK0m75MT17b2Z9qF2WJQ03XAkOJiN_g",
    authDomain: "portfolio-7d2ad.firebaseapp.com",
    projectId: "portfolio-7d2ad",
    storageBucket: "portfolio-7d2ad.firebasestorage.app",
    messagingSenderId: "18538077113",
    appId: "1:18538077113:web:51b71e26c2106aee017468",
    measurementId: "G-4N5L8H2MHF"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app); // Initialize Firebase Auth
  
  // Save submission with associated user ID if authenticated
  export const saveSubmission = async (data) => {
    try {
      const user = auth.currentUser; // Get the currently authenticated user
      if (!user) throw new Error("User is not authenticated.");
  
      const docRef = await addDoc(collection(db, "Submissions"), {
        ...data,
        userId: user.uid, // Associate submission with authenticated user's UID
        timestamp: new Date().toISOString(), // Add a timestamp
      });
  
      return docRef.id; // Return the document ID
    } catch (error) {
      console.error("Error saving submission: ", error);
      throw error;
    }
  };
  
  export { db, auth };
