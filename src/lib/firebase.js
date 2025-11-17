// src/lib/firebase.ts
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyDc8710pNnxsTFScU4THLn3Bq7dCNKnUtQ",
  authDomain: "e-commerce-534f8.firebaseapp.com",
  projectId: "e-commerce-534f8",
  storageBucket: "e-commerce-534f8.appspot.com",
  messagingSenderId: "148854132892",
  appId: "1:148854132892:web:96d602b41e922542861d59"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
export const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app)

// Export the app instance
export default app