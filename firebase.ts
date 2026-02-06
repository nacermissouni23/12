// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA-bHI591qwiQ8Rg2T0zPp2JsYxIjSCrBY",
  authDomain: "catalyst-4e6ed.firebaseapp.com",
  projectId: "catalyst-4e6ed",
  storageBucket: "catalyst-4e6ed.firebasestorage.app",
  messagingSenderId: "464305082749",
  appId: "1:464305082749:web:b795014378e6767f2f7c14",
  measurementId: "G-2M38GTHCZ5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
