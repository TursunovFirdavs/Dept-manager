import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const PublicRoute = ({ children }) => {
  const user = useAuthStore((state) => state.user);
  const userData = useAuthStore((state) => state.userData);

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
