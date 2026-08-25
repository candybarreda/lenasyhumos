import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyCPbQ5sKxg2-928kKQkPu4N4MpZUPO6_rc",
  authDomain: "lenas-y-humos.firebaseapp.com",
  projectId: "lenas-y-humos",
  storageBucket: "lenas-y-humos.firebasestorage.app",
  messagingSenderId: "929031437649",
  appId: "1:929031437649:web:49fa2a90a1685b1ba52770",
  measurementId: "G-VJXRB1M3SW"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);