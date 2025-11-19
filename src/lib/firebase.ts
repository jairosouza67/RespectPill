import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD9bcS2pNPKvmHTEWmyw4wpta9oHwdHfSQ",
  authDomain: "respect-pill.firebaseapp.com",
  projectId: "respect-pill",
  storageBucket: "respect-pill.firebasestorage.app",
  messagingSenderId: "1010603665326",
  appId: "1:1010603665326:web:bd4dab0f4edef85eb60a3f"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
