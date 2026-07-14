import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { PageLoader } from "@/components/GlobalLoader";

const PublicRoute = ({ children }) => {
  const user = useAuthStore((state) => state.user);
  const userData = useAuthStore((state) => state.userData);
  const loading = useAuthStore((state) => state.loading);

  if (loading) {
    return <PageLoader />;
  }

  if (user) {
    if (userData?.role === "admin") {
      return <Navigate to="/admin" />;
    }

    if (userData?.subscription?.status === "expired") {
      return <Navigate to="/subscription-expired" />;
    }

    if (userData?.status === "blocked") {
      return <Navigate to="/blocked" />;
    }

    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default PublicRoute;
