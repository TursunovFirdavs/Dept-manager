import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { getFirms, createFirm } from "@/services/firm.service";
import { addPurchase, addPayment } from "@/services/transaction.service";
import toast from "react-hot-toast";

export const useFirms = () => {
  const user = useAuthStore((state) => state.user);
  
  const [firms, setFirms] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const loadFirms = async () => {
    if (!user?.uid) return;
    setIsLoading(true);
    try {
      const data = await getFirms(user.uid);
      setFirms(data);
    } catch (error) {
      console.error(error);
      toast.error("Firmalarni yuklashda xatolik yuz berdi");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadFirms();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid]);

  const handleCreateFirm = async (firmData) => {
    if (!firmData.name.trim()) return false;
    
    setIsCreating(true);
    try {
      const docRef = await createFirm(user.uid, firmData);
      
      const debt = Number(firmData.initialDebt) || 0;
      const payment = Number(firmData.initialPayment) || 0;

      if (debt > 0) {
        await addPurchase(user.uid, docRef.id, firmData.name, debt, "Boshlang'ich qarz");
      }
      if (payment > 0) {
        await addPayment(user.uid, docRef.id, firmData.name, payment, "Boshlang'ich to'lov");
      }

      await loadFirms(); // Refresh the list
      toast.success("Firma muvaffaqiyatli qo'shildi");
      return true;
    } catch (error) {
      console.error(error);
      toast.error("Firma qo'shishda xatolik");
      return false;
    } finally {
      setIsCreating(false);
    }
  };

  const filteredFirms = firms.filter((firm) => 
    firm.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    firms,
    filteredFirms,
    searchQuery,
    setSearchQuery,
    isLoading,
    isCreating,
    handleCreateFirm,
    refreshFirms: loadFirms
  };
};
