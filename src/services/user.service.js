import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  collection,
  getDocs,
  updateDoc,
  Timestamp,
} from "firebase/firestore";

import { db } from "../firebase/firestore";

export const getOrCreateUser = async (user) => {
  const ref = doc(db, "users", user.uid);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) {
    const newUserData = {
      uid: user.uid,
      role: "user",
      status: "active",
      businessType: "market",
      ownerName: "",
      shopName: "",
      phone: "",
      note: "",
      firmCount: 0,
      totalDebt: 0,
      totalPurchase: 0,
      totalPayment: 0,
      subscription: {
        plan: "trial",
        status: "active",
        startDate: serverTimestamp(),
        endDate: null,
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(ref, newUserData);
    return { id: user.uid, ...newUserData };
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
};

export const getUserData = async (uid) => {
  const snapshot = await getDoc(doc(db, "users", uid));
  if (!snapshot.exists()) {
    return null;
  }
  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
};

export const getUsers = async () => {
  const snapshot = await getDocs(collection(db, "users"));

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const updateUserStatus = async (uid, status) => {
  await updateDoc(doc(db, "users", uid), {
    status,
    updatedAt: serverTimestamp(),
  });
};

export const updateSubscriptionStatus = async (uid, status) => {
  await updateDoc(doc(db, "users", uid), {
    "subscription.status": status,
    updatedAt: serverTimestamp(),
  });
};

export const updateSubscriptionDate = async (uid, date) => {
  const selectedDate = new Date(date);

  const today = new Date();

  const status = selectedDate < today ? "expired" : "active";

  await updateDoc(doc(db, "users", uid), {
    "subscription.endDate": Timestamp.fromDate(selectedDate),

    "subscription.status": status,

    updatedAt: serverTimestamp(),
  });
};

export const expireSubscription = async (uid) => {
  await updateDoc(doc(db, "users", uid), {
    "subscription.status": "expired",
    updatedAt: serverTimestamp(),
  });
};
