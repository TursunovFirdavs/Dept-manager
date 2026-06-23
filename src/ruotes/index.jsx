import { createBrowserRouter } from "react-router-dom";

import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import FirmsPage from "../pages/Firms";
import FirmDetails from "../pages/FirmDetails";
import CalendarPage from "../pages/Calendar";
import AdminRoute from "./AdminRoute";
import Admin from "../pages/Admin";
import SubscriptionExpired from "../pages/SubscribtionExpired";
import SubscriptionRoute from "./SubscriptionRoute";

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
        element: <Dashboard />,
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
