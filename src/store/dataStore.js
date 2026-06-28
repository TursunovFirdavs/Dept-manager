import { create } from "zustand";
import { getFirms } from "@/services/firm.service";

export const useDataStore = create((set, get) => ({
  firms: [],
  isFirmsLoaded: false,
  isFirmsLoading: false,

  fetchFirms: async (uid, force = false) => {
    // Agar keshda bo'lsa va force qilinmasa, yana backendga murojaat qilmaymiz
    if (get().isFirmsLoaded && !force) return;

    set({ isFirmsLoading: true });
    try {
      const data = await getFirms(uid);
      set({ firms: data, isFirmsLoaded: true });
    } catch (error) {
      console.error("Firmalarni yuklashda xato:", error);
    } finally {
      set({ isFirmsLoading: false });
    }
  },

  // Firma qo'shilganda yoki tranzaksiya qilinganda keshni yangilash uchun
  invalidateFirms: () => set({ isFirmsLoaded: false }),
}));
