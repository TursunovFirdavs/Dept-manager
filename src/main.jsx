import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import { router } from "./ruotes";

import AuthProvider from "./components/AuthProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>,
);
