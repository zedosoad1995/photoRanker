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
  PHOTO_DETAILS,
  ADMIN_PHOTOS,
  PRIVACY,
  TERMS,
} from "./Constants/routes.ts";
import { AuthProvider } from "@/Contexts/auth.tsx";
import ProtectedLayout from "./Components/Layout/Layout.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "react-query";
import UnprotectedLayout from "./Components/Layout/UnprotectedLayout/Layout.tsx";
import App from "./Pages/App/index.tsx";
import RedirectLayout from "./Components/RedirectLayout.tsx";
import { NotFoundPage } from "./Pages/404.tsx";
import { PhotosProvider } from "./Contexts/photos.tsx";
import AdminLayout from "./Components/Layout/AdminLayout.tsx";

import { lazy, Suspense } from "react";
import FullPageLoading from "./Components/Loading/FullPageLoading.tsx";

const SignIn = lazy(() => import("./Pages/Login.tsx"));
const Register = lazy(() => import("./Pages/Register/Register.tsx"));
const Settings = lazy(() => import("./Pages/Settings/Settings.tsx"));
const Vote = lazy(() => import("./Pages/Vote/Vote.tsx"));
const MyPhotos = lazy(() => import("./Pages/MyPhotos/MyPhotos.tsx"));
const PhotoDetails = lazy(
  () => import("./Pages/PhotoDetails/PhotoDetails.tsx")
);
const AdminPhotos = lazy(() => import("./Pages/Admin/Photos/Photos.tsx"));
const Terms = lazy(() => import("./Pages/Terms.tsx"));
const Privacy = lazy(() => import("./Pages/Privacy.tsx"));
const FacebookCallback = lazy(() => import("./Pages/FacebookCallback.tsx"));
const ExpiredValidation = lazy(() => import("./Pages/ExpiredValidation.tsx"));
const CheckingValidation = lazy(() => import("./Pages/CheckingValidation.tsx"));
const ForgotPassword = lazy(() => import("./Pages/ForgotPassword.tsx"));
const ResetPassword = lazy(() => import("./Pages/ResetPassword.tsx"));

if (import.meta.env.VITE_ENV === "PROD") {
  console.log = () => {};
  console.error = () => {};
}

const router = createBrowserRouter([
  {
    errorElement: <NotFoundPage />,
  },
  {
    element: (
      <Suspense fallback={<FullPageLoading />}>
        <ProtectedLayout />
      </Suspense>
    ),
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
        path: PHOTO_DETAILS,
        element: <PhotoDetails />,
      },
      {
        path: SETTINGS,
        element: <Settings />,
      },
      {
        element: <AdminLayout />,
        children: [
          {
            path: ADMIN_PHOTOS,
            element: <AdminPhotos />,
          },
        ],
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
    element: (
      <Suspense fallback={<FullPageLoading />}>
        <UnprotectedLayout />
      </Suspense>
    ),
    children: [
      {
        element: <RedirectLayout />,
        children: [
          {
            path: HOME,
            element: <App />,
          },
          {
            path: TERMS,
            element: <Terms />,
          },
          {
            path: PRIVACY,
            element: <Privacy />,
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
