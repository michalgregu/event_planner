import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA2eDeW9aMWrcDGcUCC8qtVHt90ITDD0Ew",
  authDomain: "event-planner-8bbf8.firebaseapp.com",
  projectId: "event-planner-8bbf8",
  storageBucket: "event-planner-8bbf8.appspot.com",
  messagingSenderId: "624768193488",
  appId: "1:624768193488:web:35b9791f88aaff9aa41fd5",
  measurementId: "G-P2Q5KER3JB",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
