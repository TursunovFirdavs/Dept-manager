import {
  collection,
  doc,
  writeBatch,
  increment,
  serverTimestamp,
  query,
  orderBy,
  getDocs,
} from "firebase/firestore";

import { db } from "../firebase/firestore";

export const addPurchase = async (uid, firmId, firmName, amount, note = "") => {
  const batch = writeBatch(db);
  
  const txData = {
    firmId,
    firmName,
    type: "purchase",
    amount,
    note,
    createdAt: serverTimestamp(),
  };

  // 1. Firma ichidagi transaction
  const firmTxRef = doc(collection(db, "users", uid, "firms", firmId, "transactions"));
  batch.set(firmTxRef, txData);

  // 2. Global ledger
  const globalTxRef = doc(collection(db, "users", uid, "transactions"));
  batch.set(globalTxRef, txData);

  // 3. Firm hisobini yangilash
  const firmRef = doc(db, "users", uid, "firms", firmId);
  batch.update(firmRef, {
    balance: increment(amount),
    totalPurchase: increment(amount),
  });

  // 4. Foydalanuvchining umumiy hisobini (global datani) yangilash
  const userRef = doc(db, "users", uid);
  batch.update(userRef, {
    totalDebt: increment(amount),
    totalPurchase: increment(amount),
  });

  await batch.commit();
};

export const addPayment = async (uid, firmId, firmName, amount, note = "") => {
  const batch = writeBatch(db);

  const txData = {
    firmId,
    firmName,
    type: "payment",
    amount,
    note,
    createdAt: serverTimestamp(),
  };

  const firmTxRef = doc(collection(db, "users", uid, "firms", firmId, "transactions"));
  batch.set(firmTxRef, txData);

  const globalTxRef = doc(collection(db, "users", uid, "transactions"));
  batch.set(globalTxRef, txData);

  const firmRef = doc(db, "users", uid, "firms", firmId);
  batch.update(firmRef, {
    balance: increment(-amount),
    totalPayment: increment(amount),
  });

  const userRef = doc(db, "users", uid);
  batch.update(userRef, {
    totalDebt: increment(-amount),
    totalPayment: increment(amount),
  });

  await batch.commit();
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
