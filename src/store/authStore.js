import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  userData: null,
  loading: true,

  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  setUserData: (userData) => set({ userData }),
  setLoading: (loading) => set({ loading }),
}));
