import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const ProtectedRoute = ({ children }) => {
  const user = useAuthStore((state) => state.user);

  const userData = useAuthStore((state) => state.userData);

  const loading = useAuthStore((state) => state.loading);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (userData?.status === "blocked") {
    return <Navigate to="/blocked" replace />;
  }

  // if (userData?.subscription?.status === "expired") {
  //   return <Navigate to="/subscription-expired" replace />;
  // }

  return children;
};

export default ProtectedRoute;
