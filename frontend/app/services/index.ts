import axios, { AxiosInstance, AxiosResponse } from "axios";

interface ApiResponse<T> {
  data: T;
}

const api: AxiosInstance = axios.create({
  baseURL: process.env.BACKEND_URL,
});

api.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
