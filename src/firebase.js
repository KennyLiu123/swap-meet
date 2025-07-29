import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCSqj_1nByv29rJaJSssh3MhR3YTB7ZD3I",
  authDomain: "swap-meet-6976c.firebaseapp.com",
  projectId: "swap-meet-6976c",
  storageBucket: "swap-meet-6976c.firebasestorage.app",
  messagingSenderId: "775432417419",
  appId: "1:775432417419:web:e59276fb5ed69379d9a48e",
  measurementId: "G-5V2TPL37X1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);