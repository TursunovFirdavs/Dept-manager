import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { getFirms, createFirm } from "@/services/firm.service";
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

  const handleCreateFirm = async (name) => {
    if (!name.trim()) return false;
    
    setIsCreating(true);
    try {
      await createFirm(user.uid, { name: name.trim() });
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
