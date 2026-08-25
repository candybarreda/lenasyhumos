import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "../firebase/firebaseConfig";

export const getDishes = async () => {
  const dishesRef = collection(db, "dishes");

  const snapshot = await getDocs(dishesRef);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};