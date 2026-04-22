import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // Auth import karna zaroori hai

const firebaseConfig = {
  apiKey: "AIzaSyDIcWh18Xue98OTGClaDGrCpmmaXqicAlo",
  authDomain: "examtel-d8a2c.firebaseapp.com",
  projectId: "examtel-d8a2c",
  storageBucket: "examtel-d8a2c.firebasestorage.app",
  messagingSenderId: "279521584826",
  appId: "1:279521584826:web:f99864ddecc4ebcfaf0483",
  measurementId: "G-8N9FRY474T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Ise export karein taaki App.js mein use kar sakein
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
