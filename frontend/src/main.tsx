import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { HOME, LOGIN, REGISTER, SETTINGS, VOTE } from "./Constants/routes.ts";
import SignIn from "./Pages/Login.tsx";
import Register from "./Pages/Register/Register.tsx";
import { AuthProvider } from "@/Contexts/auth.tsx";
import ProtectedLayout from "./Components/Layout/Layout.tsx";
import Settings from "./Pages/Settings.tsx";
import Vote from "./Pages/Vote.tsx";

const router = createBrowserRouter([
  {
    element: <ProtectedLayout />,
    children: [
      {
        path: HOME,
        element: <Navigate to={VOTE} />,
      },
      {
        path: VOTE,
        element: <Vote />,
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
