// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "pantry-tracker-3c095.firebaseapp.com",
  projectId: "pantry-tracker-3c095",
  storageBucket: "pantry-tracker-3c095.appspot.com",
  messagingSenderId: "87290647585",
  appId: "1:87290647585:web:12cf5d647f7b469daf7f60",
  measurementId: "G-GB0NNPF1NX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {app, firestore };
