import { useEffect } from "react";

import { observeAuth } from "../services/auth.service";

import { useAuthStore } from "../store/authStore";

import { createUserIfNotExists, getUserData } from "../services/user.service";

export default function AuthProvider({ children }) {
  const setUser = useAuthStore((state) => state.setUser);

  const setToken = useAuthStore((state) => state.setToken);

  const setLoading = useAuthStore((state) => state.setLoading);

  const setUserData = useAuthStore((state) => state.setUserData);

  useEffect(() => {
    const unsub = observeAuth(async (user) => {
      if (user) {
        const token = await user.getIdToken();

        await createUserIfNotExists(user);

        const userData = await getUserData(user.uid);

        setUser(user);

        setToken(token);

        setUserData(userData);
      } else {
        setUser(null);

        setToken(null);

        setUserData(null);
      }

      setLoading(false);
    });

    return unsub;
  }, []);

  return children;
}
