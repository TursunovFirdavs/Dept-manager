import {
  collection,
  addDoc,
  doc,
  updateDoc,
  increment,
  serverTimestamp,
  query,
  orderBy,
  getDocs,
} from "firebase/firestore";

import { db } from "../firebase/firestore";

export const addPurchase = async (uid, firmId, firmName, amount, note = "") => {
  const txData = {
    firmId,
    firmName,

    type: "purchase",
    amount,
    note,

    createdAt: serverTimestamp(),
  };

  // Firma ichidagi transaction

  await addDoc(
    collection(db, "users", uid, "firms", firmId, "transactions"),
    txData,
  );

  // Global ledger

  await addDoc(collection(db, "users", uid, "transactions"), txData);

  // Firm hisobini yangilash

  await updateDoc(doc(db, "users", uid, "firms", firmId), {
    balance: increment(amount),
    totalPurchase: increment(amount),
  });
};

export const addPayment = async (uid, firmId, firmName, amount, note = "") => {
  const txData = {
    firmId,
    firmName,

    type: "payment",
    amount,
    note,

    createdAt: serverTimestamp(),
  };

  await addDoc(
    collection(db, "users", uid, "firms", firmId, "transactions"),
    txData,
  );

  await addDoc(collection(db, "users", uid, "transactions"), txData);

  await updateDoc(doc(db, "users", uid, "firms", firmId), {
    balance: increment(-amount),
    totalPayment: increment(amount),
  });
};

export const getTransactions = async (uid, firmId) => {
  const q = query(
    collection(db, "users", uid, "firms", firmId, "transactions"),
    orderBy("createdAt", "desc"),
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const getAllTransactions = async (uid) => {
  const q = query(
    collection(db, "users", uid, "transactions"),
    orderBy("createdAt", "desc"),
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};
