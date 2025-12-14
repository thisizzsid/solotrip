import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your specific configuration
const firebaseConfig = {
  apiKey: "AIzaSyCWLYVFhFZLWwEixOKJoHbVR5fgA2mkoG0",
  authDomain: "solotrip-prod.firebaseapp.com",
  projectId: "solotrip-prod",
  storageBucket: "solotrip-prod.firebasestorage.app", // Fixed bucket URL format
  messagingSenderId: "635102438198",
  appId: "1:635102438198:web:98c494fabe4092d4814997"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the tools we need everywhere
export const auth = getAuth(app);       // Login System
export const db = getFirestore(app);    // Database
export const storage = getStorage(app); // Image Storage