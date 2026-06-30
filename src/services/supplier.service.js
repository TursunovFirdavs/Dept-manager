import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  getDoc,
  doc,
  query,
  where,
  orderBy,
} from "firebase/firestore";

import { db } from "../firebase/firestore";

export const createSupplier = async (uid, data) => {
  return addDoc(collection(db, "users", uid, "suppliers"), {
    name: data.name,
    phone: data.phone || "",
    balance: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const getSuppliers = async (uid) => {
  const snapshot = await getDocs(collection(db, "users", uid, "suppliers"));

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const getSupplierById = async (uid, supplierId) => {
  const snapshot = await getDoc(doc(db, "users", uid, "suppliers", supplierId));

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
};

export const getSupplierTransactionsByDate = async (
  uid,
  startDate,
  endDate,
) => {
  const q = query(
    collection(db, "users", uid, "suppliers"),
    where("createdAt", ">=", startDate),
    where("createdAt", "<=", endDate),
    orderBy("createdAt", "desc"),
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};
