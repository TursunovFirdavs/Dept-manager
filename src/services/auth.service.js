import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import { auth } from "../firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/firebase/firestore";

export const observeAuth = (callback) => {
  return onAuthStateChanged(auth, callback);
};

export const loginUser = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const registerUser = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const createUserProfile = async (uid, data) => {
  await setDoc(doc(db, "users", uid), {
    uid,

    shopName: data.shopName,
    username: data.username,
    phone: data.phone,
    description: data.description || "",

    role: "user",
    status: "active",
    shopType: "market",

    firmCount: 0,

    totalDebt: 0,
    totalPurchase: 0,
    totalPayment: 0,

    subscription: {
      status: "active",
      plan: "trial",
      startDate: serverTimestamp(),
      endDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    },

    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const logoutUser = () => {
  return signOut(auth);
};
