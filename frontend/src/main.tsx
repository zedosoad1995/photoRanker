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
  PHOTO_VOTING_STATS,
  PHOTO_STATS,
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
import App from "./Pages/App/index.tsx";
import RedirectLayout from "./Components/RedirectLayout.tsx";
import { NotFoundPage } from "./Pages/404.tsx";
import { PhotoVotingStats } from "./Pages/PhotoVotingStats.tsx";
import { PhotosProvider } from "./Contexts/photos.tsx";
import { PhotoStats } from "./Pages/PhotoStats/PhotoStats.tsx";

if (import.meta.env.VITE_ENV === "PROD") {
  console.log = () => {};
  console.error = () => {};
}

const router = createBrowserRouter([
  {
    errorElement: <NotFoundPage />,
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
        path: PHOTO_VOTING_STATS,
        element: <PhotoVotingStats />,
      },
      {
        path: PHOTO_STATS,
        element: <PhotoStats />,
      },
      {
        path: SETTINGS,
        element: <Settings />,
      },
    ],
  },
  {
    element: <RedirectLayout />,
    children: [
      {
        path: HOME,
        element: <App />,
      },
    ],
  },
  {
    element: <UnprotectedLayout />,
    children: [
      {
        element: <RedirectLayout />,
        children: [
          {
            path: HOME,
            element: <App />,
          },
          {
            path: LOGIN,
            element: <SignIn />,
          },
          {
            path: REGISTER,
            element: <Register />,
          },
        ],
      },
      {
        path: FACEBOOK_CALLBACK,
        element: <FacebookCallback />,
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
          <PhotosProvider>
            <Toaster position="top-center" reverseOrder={false} />
            <RouterProvider router={router} />
          </PhotosProvider>
        </AuthProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
