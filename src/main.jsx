import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import "./App.css";

import { router } from "./ruotes";

import AuthProvider from "./components/AuthProvider";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <Toaster position="top-right" />
    <RouterProvider router={router} />
  </AuthProvider>,
);
