import { IPreferenceRes, IUpdatePreferencesBody } from "@/Types/preference";
import api from "./index";

export const getPreferences = async (userId: string): Promise<IPreferenceRes> => {
  return api.get(`/preferences/${userId}`);
};

export const updatePreferences = async (
  userId: string,
  body: IUpdatePreferencesBody
): Promise<IPreferenceRes> => {
  return api.patch(`/preferences/${userId}`, body);
};
