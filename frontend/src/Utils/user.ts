import { IUser } from "@/Types/user";

export const getLoggedUser = (): IUser | null => {
  const storedUser = localStorage.getItem("user");

  if (!storedUser) {
    return null;
  }

  return JSON.parse(storedUser);
};

export const setLoggedUser = (user?: IUser): void => {
  if (!user) return;

  localStorage.setItem("user", JSON.stringify(user));
};
