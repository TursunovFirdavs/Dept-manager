import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const SubscriptionRoute = ({ children }) => {
  const user = useAuthStore((state) => state.user);

  const userData = useAuthStore((state) => state.userData);

  const loading = useAuthStore((state) => state.loading);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (userData?.subscription?.status !== "expired") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default SubscriptionRoute;
