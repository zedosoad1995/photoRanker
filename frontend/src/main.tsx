import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  HOME,
  LOGIN,
  PHOTOS,
  REGISTER,
  SETTINGS,
  VOTE,
  FACEBOOK_CALLBACK,
  EXPIRED_VALIDATION,
  CHECKING_VALIDATION,
  FORGOT_PASSWORD,
  RESET_PASSWORD,
} from "./Constants/routes.ts";
import SignIn from "./Pages/Login.tsx";
import Register from "./Pages/Register/Register.tsx";
import { AuthProvider } from "@/Contexts/auth.tsx";
import ProtectedLayout from "./Components/Layout/Layout.tsx";
import Settings from "./Pages/Settings/Settings.tsx";
import Vote from "./Pages/Vote/Vote.tsx";
import MyPhotos from "./Pages/MyPhotos/MyPhotos.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import FacebookCallback from "./Pages/FacebookCallback.tsx";
import ExpiredValidation from "./Pages/ExpiredValidation.tsx";
import CheckingValidation from "./Pages/CheckingValidation.tsx";
import ForgotPassword from "./Pages/ForgotPassword.tsx";
import ResetPassword from "./Pages/ResetPassword.tsx";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "react-query";
import UnprotectedLayout from "./Components/UnprotectedLayout/Layout.tsx";
import App from "./App.tsx";

if (import.meta.env.VITE_ENV === "PROD") {
  console.log = () => {};
  console.error = () => {};
}

const router = createBrowserRouter([
  {
    path: HOME,
    element: <App />,
  },
  {
    element: <ProtectedLayout />,
    children: [
      {
        path: VOTE,
        element: <Vote />,
      },
      {
        path: PHOTOS,
        element: <MyPhotos />,
      },
      {
        path: SETTINGS,
        element: <Settings />,
      },
    ],
  },
  {
    element: <UnprotectedLayout />,
    children: [
      {
        path: LOGIN,
        element: <SignIn />,
      },
      {
        path: FACEBOOK_CALLBACK,
        element: <FacebookCallback />,
      },
      {
        path: REGISTER,
        element: <Register />,
      },
      {
        path: EXPIRED_VALIDATION,
        element: <ExpiredValidation />,
      },
      {
        path: `${CHECKING_VALIDATION}/:token`,
        element: <CheckingValidation />,
      },
      {
        path: FORGOT_PASSWORD,
        element: <ForgotPassword />,
      },
      {
        path: `${RESET_PASSWORD}/:token`,
        element: <ResetPassword />,
      },
    ],
  },
]);

export const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_ID!}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Toaster position="top-center" reverseOrder={false} />
          <RouterProvider router={router} />
        </AuthProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
