import { createBrowserRouter, Navigate } from "react-router-dom";

import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";

import Login from "../pages/Login";
import Register from "../pages/Register";
import FirmsPage from "../pages/Firms";
import AddFirm from "../pages/AddFirm";
import FirmDetails from "../pages/FirmDetails";
import AdminRoute from "./AdminRoute";
import Admin from "../pages/Admin";
import SubscriptionExpired from "../pages/SubscribtionExpired";
import SubscriptionRoute from "./SubscriptionRoute";
import Blocked from "../pages/Blocked";
import BlockedRoute from "./BlockedRoute";
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";
import DashboardPage from "@/pages/Dashboard";
import ProfilePage from "@/pages/Profile";
import ProfileEdit from "@/pages/ProfileEdit";
import Transactions from "@/pages/Transactions";
import StatisticsPage from "@/pages/Statistics";
import SuppliersPage from "@/pages/Suppliers";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
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
      {
        path: "/register",
        element: (
          <PublicRoute>
            <Register />
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
        path: "/firms/add",
        element: <AddFirm />,
      },
      {
        path: "/firms/:firmId",
        element: <FirmDetails />,
      },
      {
        path: "/transactions",
        element: <Transactions />,
      },
      {
        path: "/statistika",
        element: <StatisticsPage />,
      },
      {
        path: "/suppliers",
        element: <SuppliersPage />,
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
  {
    path: "/blocked",
    element: (
      <BlockedRoute>
        <Blocked />
      </BlockedRoute>
    ),
  },
]);
