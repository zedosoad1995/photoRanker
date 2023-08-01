import { IGetMeRes, IUserNoPassword } from "../../../backend/src/types/user";

export const getLoggedUser = (): IUserNoPassword["user"] | null => {
  const storedUser = localStorage.getItem("user");

  if (!storedUser) {
    return null;
  }

  return JSON.parse(storedUser);
};

export const setLoggedUser = (user?: IGetMeRes["user"]): void => {
  if (!user) return;

  localStorage.setItem("user", JSON.stringify(user));
};
