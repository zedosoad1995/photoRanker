import api from "./index";

export const deleteMe = async (): Promise<void> => {
  return api.delete("users/me");
};
