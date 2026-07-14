import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";
import { createSupplier, getSuppliers } from "@/services/supplier.service";
import { addSupplierPayment } from "@/services/transaction.service";

export const useSuppliers = () => {
  const user = useAuthStore((state) => state.user);

  const [suppliers, setSuppliers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDay, setSelectedDay] = useState(() => {
    const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    return days[new Date().getDay()];
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const loadSuppliers = async () => {
    if (!user?.uid) return;
    setIsLoading(true);
    try {
      const data = await getSuppliers(user.uid);
      setSuppliers(data);
    } catch (error) {
      console.error(error);
      toast.error("Firmalarni yuklashda xatolik yuz berdi");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadSuppliers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid]);

  const handleCreateSupplier = async (data) => {
    if (!data.name?.trim()) return false;

    setIsCreating(true);
    try {
      const docRef = await createSupplier(user.uid, {
        name: data.name.trim(),
        phone: data.phone,
        balance: 0,
        visitDay: data.visitDay,
      });

      const parsedBalance = Number(data.balance);
      if (parsedBalance > 0) {
        await addSupplierPayment(
          user.uid,
          docRef.id,
          data.name.trim(),
          parsedBalance,
          "",
        );
      }

      await loadSuppliers(); // Refresh the list
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

  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch = supplier.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesDay = supplier.visitDay
      ? supplier.visitDay === selectedDay
      : true; // agar visitDay yo'q bo'lsa (eski data) ko'rsataveradi yoki default ko'rsatmaslik kerakmi? Yaxshisi visitDay yo'qlarni ham ko'rsataylik yoki faqat moslarini.
    // Odatda yangilarda visitDay bo'ladi.
    return matchesSearch && matchesDay;
  });

  return {
    suppliers,
    filteredSuppliers,
    searchQuery,
    setSearchQuery,
    selectedDay,
    setSelectedDay,
    isLoading,
    isCreating,
    handleCreateSupplier,
    refreshSuppliers: loadSuppliers,
  };
};
