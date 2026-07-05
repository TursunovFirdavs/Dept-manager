import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { PageLoader } from "@/components/GlobalLoader";

const BlockedRoute = ({ children }) => {
  const user = useAuthStore((state) => state.user);
  const userData = useAuthStore((state) => state.userData);
  const loading = useAuthStore((state) => state.loading);

  if (loading) {
    return <PageLoader />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (userData?.status !== "blocked") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default BlockedRoute;
