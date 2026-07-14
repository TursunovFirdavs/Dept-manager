import {
  collection,
  doc,
  writeBatch,
  increment,
  serverTimestamp,
  query,
  orderBy,
  getDocs,
  limit,
  where,
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
    limit(50)
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
    limit(100)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const getTransactionsByDateRange = async (uid, startDate, endDate) => {
  const q = query(
    collection(db, "users", uid, "transactions"),
    where("createdAt", ">=", startDate),
    where("createdAt", "<=", endDate),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const addSupplierPayment = async (uid, supplierId, supplierName, amount, note = "") => {
  const batch = writeBatch(db);

  const txData = {
    supplierId,
    supplierName,
    type: "payment",
    amount,
    note,
    createdAt: serverTimestamp(),
  };

  // 1. O'zining tranzaksiyalari (yoki faqat global supplierTransactions da saqlash)
  // Biz global "supplierTransactions" kolleksiyasiga saqlaymiz:
  const supplierTxRef = doc(collection(db, "users", uid, "supplierTransactions"));
  batch.set(supplierTxRef, txData);

  // 2. Firma balansi yangilanadi (agar kiritilsa qo'shiladi yoki ayiriladi)
  // Biz to'lovni beramiz, shuning uchun supplier balansidan ayrilishi yoki unga qo'shilishi - bunesa biznes mantiq.
  // Odatda, qarzdorga + qarz qo'shilsa balans oshadi, to'lov qilsak kamayadi. 
  // Agar biz supplierga (ta'minotchiga) to'lov qilsak, uning balansi -amount bo'ladi.
  const supplierRef = doc(db, "users", uid, "suppliers", supplierId);
  batch.update(supplierRef, {
    balance: increment(amount),
  });

  await batch.commit();
};

export const getSupplierTransactions = async (uid) => {
  const q = query(
    collection(db, "users", uid, "supplierTransactions"),
    orderBy("createdAt", "desc"),
    limit(100)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};
export const getSupplierTransactionsByDateRange = async (uid, startDate, endDate) => {
  const q = query(
    collection(db, "users", uid, "supplierTransactions"),
    where("createdAt", ">=", startDate),
    where("createdAt", "<=", endDate),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};
