import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HOME, LOGIN, REGISTER, SETTINGS } from "./Constants/routes.ts";
import SignIn from "./Pages/Login.tsx";
import Register from "./Pages/Register/Register.tsx";
import { AuthProvider } from "@/Contexts/auth.tsx";
import ProtectedLayout from "./Components/Layout/Layout.tsx";
import Settings from "./Pages/Settings.tsx";

const router = createBrowserRouter([
  {
    element: <ProtectedLayout />,
    children: [
      {
        path: HOME,
        element: <App />,
      },
      {
        path: SETTINGS,
        element: <Settings />,
      },
    ],
  },
  {
    path: LOGIN,
    element: <SignIn />,
  },
  {
    path: REGISTER,
    element: <Register />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
