import { Navigate } from "react-router-dom";

import { useAuthStore } from "../store/authStore";

const AdminRoute = ({ children }) => {
  const userData = useAuthStore((state) => state.userData);

  if (!userData) {
    return null;
  }

  if (userData.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AdminRoute;
