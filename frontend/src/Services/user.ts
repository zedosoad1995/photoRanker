import { IUserRes } from "@/Types/user";
import api from "./index";

export const getUser = async (userId: string): Promise<IUserRes> => {
  return api.get(`users/${userId}`);
};

export const getMe = async (): Promise<IUserRes> => {
  return api.get("/users/me");
};

export const deleteMe = async (): Promise<void> => {
  return api.delete("users/me");
};

export const banUser = async (userId: string): Promise<void> => {
  return api.put(`users/ban/${userId}`);
};
