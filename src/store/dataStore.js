import { create } from "zustand";
import { getFirms } from "@/services/firm.service";
import { getSuppliers } from "@/services/supplier.service";

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

export const useSuppliersStore = create((set, get) => ({
  suppliers: [],
  isSuppliersLoaded: false,
  isSuppliersLoading: false,

  fetchSuppliers: async (uid, force = false) => {
    // Agar keshda bo'lsa va force qilinmasa, yana backendga murojaat qilmaymiz
    if (get().isSuppliersLoaded && !force) return;

    set({ isSuppliersLoading: true });
    try {
      const data = await getSuppliers(uid);
      set({ suppliers: data, isSuppliersLoaded: true });
    } catch (error) {
      console.error("Firmalarni yuklashda xato:", error);
    } finally {
      set({ isSuppliersLoading: false });
    }
  },

  // Firma qo'shilganda yoki tranzaksiya qilinganda keshni yangilash uchun
  invalidateSuppliers: () => set({ isSuppliersLoaded: false }),
}));
