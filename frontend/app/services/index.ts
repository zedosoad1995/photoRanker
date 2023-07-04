import axios, { AxiosInstance, AxiosResponse } from "axios";

console.log(process.env.BACKEND_URL);

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
