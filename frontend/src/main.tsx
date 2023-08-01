import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
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
import Settings from "./Pages/Settings.tsx";
import Vote from "./Pages/Vote.tsx";
import MyPhotos from "./Pages/MyPhotos/MyPhotos.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import FacebookCallback from "./Pages/FacebookCallback.tsx";
import ExpiredValidation from "./Pages/ExpiredValidation.tsx";
import CheckingValidation from "./Pages/CheckingValidation.tsx";
import ForgotPassword from "./Pages/ForgotPassword.tsx";
import ResetPassword from "./Pages/ResetPassword.tsx";

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
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_ID!}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
