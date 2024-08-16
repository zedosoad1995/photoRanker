import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { logout } from "./auth";
import { LOGIN, AUTH_ROUTES } from "@/Constants/routes";
import { matchPath } from "react-router-dom";

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

api.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  async (error: AxiosError) => {
    if (
      error.response?.status === 401 &&
      "error" in (error.response.data as any)
    ) {
      const isPathProtected = AUTH_ROUTES.some((path) =>
        matchPath({ path }, window.location.pathname)
      );

      if (isPathProtected) {
        await logout();
        window.location.href = LOGIN;
      }
    }

    return Promise.reject(error);
  }
);

api.defaults.withCredentials = true;

export default api;
