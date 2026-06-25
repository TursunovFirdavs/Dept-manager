import { useEffect } from "react";

import { observeAuth } from "../services/auth.service";

import { useAuthStore } from "../store/authStore";

import {
  createUserIfNotExists,
  expireSubscription,
  getUserData,
} from "../services/user.service";

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

        const endDate = userData?.subscription?.endDate;

        if (endDate) {
          const subscriptionEnd = endDate.toDate();
          console.log(subscriptionEnd);

          const today = new Date();

          if (subscriptionEnd < today) {
            await expireSubscription(user.uid);

            userData.subscription = {
              ...userData.subscription,
              status: "expired",
            };
          }
        }

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return children;
}
