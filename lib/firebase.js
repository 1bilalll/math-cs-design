// lib/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAWqpTTFxb0aB0TwGi5K5HlMh--nV83nNY",
  authDomain: "math-cs-design.firebaseapp.com",
  projectId: "math-cs-design",
  storageBucket: "math-cs-design.firebasestorage.app",
  messagingSenderId: "332103400594",
  appId: "1:332103400594:web:f15527c479ff08b90f7a4b",
  measurementId: "G-07J88V84MG"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

