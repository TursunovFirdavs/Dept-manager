import { createBrowserRouter } from "react-router-dom";

import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";

import Login from "../pages/Login";
import FirmsPage from "../pages/Firms";
import FirmDetails from "../pages/FirmDetails";
import CalendarPage from "../pages/Calendar";
import AdminRoute from "./AdminRoute";
import Admin from "../pages/Admin";
import SubscriptionExpired from "../pages/SubscribtionExpired";
import SubscriptionRoute from "./SubscriptionRoute";
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";
import DashboardPage from "@/pages/Dashboard";
import ProfilePage from "@/pages/Profile";
import ProfileEdit from "@/pages/ProfileEdit";

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: (
          <PublicRoute>
            <Login />
          </PublicRoute>
        ),
      },
    ],
  },

  {
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/dashboard",
        element: <DashboardPage />,
      },
      {
        path: "/firms",
        element: <FirmsPage />,
      },
      {
        path: "/firms/:firmId",
        element: <FirmDetails />,
      },
      {
        path: "/calendar",
        element: <CalendarPage />,
      },
      {
        path: "/admin",
        element: (
          <AdminRoute>
            <Admin />
          </AdminRoute>
        ),
      },
      {
        path: "/profile",
        element: <ProfilePage />,
      },
      {
        path: "/profile/edit",
        element: <ProfileEdit />,
      },
    ],
  },

  {
    path: "/subscription-expired",
    element: (
      <SubscriptionRoute>
        <SubscriptionExpired />
      </SubscriptionRoute>
    ),
  },
]);
