import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { PageLoader } from "@/components/GlobalLoader";

const SubscriptionRoute = ({ children }) => {
  const user = useAuthStore((state) => state.user);

  const userData = useAuthStore((state) => state.userData);

  const loading = useAuthStore((state) => state.loading);

  if (loading) {
    return <PageLoader />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  const endDate = userData?.subscription?.endDate?.toDate 
    ? userData.subscription.endDate.toDate() 
    : null;
    
  const isExpired = endDate ? new Date() > endDate : false;

  if (!isExpired && userData?.subscription?.status !== "expired") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default SubscriptionRoute;
