import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import "./App.css";

import { router } from "./ruotes";

import AuthProvider from "./components/AuthProvider";
import { Toaster } from "react-hot-toast";

import { StatusBar, Style } from "@capacitor/status-bar";
import { Capacitor } from "@capacitor/core";

// Status bar konfiguratsiyasi (app rangiga moslash)
if (Capacitor.isNativePlatform()) {
  try {
    StatusBar.setStyle({ style: Style.Dark }); // Oq fon uchun qora iconlar
    StatusBar.setBackgroundColor({ color: "#ffffff" }); // Tepa orqa fon rangi oq
  } catch (error) {
    console.error("StatusBar error:", error);
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <Toaster position="top-right" />
    <RouterProvider router={router} />
  </AuthProvider>,
);
