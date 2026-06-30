import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";
import { createSupplier, getSuppliers } from "@/services/supplier.service";

export const useSuppliers = () => {
  const user = useAuthStore((state) => state.user);

  const [suppliers, setSuppliers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
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

  const handleCreateSupplier = async (name) => {
    if (!name.trim()) return false;

    setIsCreating(true);
    try {
      await createSupplier(user.uid, { name: name.trim() });
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

  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return {
    suppliers,
    filteredSuppliers,
    searchQuery,
    setSearchQuery,
    isLoading,
    isCreating,
    handleCreateSupplier,
    refreshSuppliers: loadSuppliers,
  };
};
