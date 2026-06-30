import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firestore";

const SETTINGS_DOC_ID = "paymentInfo";

export const getPaymentSettings = async () => {
  try {
    const ref = doc(db, "settings", SETTINGS_DOC_ID);
    const snapshot = await getDoc(ref);
    if (snapshot.exists()) {
      return snapshot.data();
    }
    return {
      cardNumber: "8600 0000 0000 0000",
      ownerName: "Admin Ismi",
    };
  } catch (error) {
    console.error("Error fetching payment settings:", error);
    return {
      cardNumber: "8600 0000 0000 0000",
      ownerName: "Admin Ismi",
    };
  }
};

export const updatePaymentSettings = async (cardNumber, ownerName) => {
  const ref = doc(db, "settings", SETTINGS_DOC_ID);
  
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) {
    await setDoc(ref, {
      cardNumber,
      ownerName,
    });
  } else {
    await updateDoc(ref, {
      cardNumber,
      ownerName,
    });
  }
};
