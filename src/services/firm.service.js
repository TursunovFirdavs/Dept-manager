import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  getDoc,
  doc,
} from "firebase/firestore";

import { db } from "../firebase/firestore";

export const createFirm = async (uid, data) => {
  return addDoc(collection(db, "users", uid, "firms"), {
    name: data.name,
    phone: data.phone || "",
    address: data.address || "",

    balance: 0,

    totalPurchase: 0,
    totalPayment: 0,

    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const getFirms = async (uid) => {
  const snapshot = await getDocs(collection(db, "users", uid, "firms"));

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const getFirmById = async (uid, firmId) => {
  const snapshot = await getDoc(doc(db, "users", uid, "firms", firmId));

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
};
