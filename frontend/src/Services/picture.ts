import { IGetManyPictures, PictureRes } from "@/Types/picture";
import api from "./index";
import { GENDER } from "@shared/constants/user";

export const getManyPictures = async (
  queryParams: {
    userId?: string;
    hasReport?: boolean;
    belongsToMe?: boolean;
    isBanned?: boolean;
    gender?: string | null;
    minAge?: number;
    maxAge?: number;
    orderBy?: string;
    orderByDir?: string;
    limit?: number;
    cursor?: string;
    isGlobal?: boolean;
  } = { gender: GENDER.Female, isGlobal: true }
): Promise<IGetManyPictures> => {
  return api.get(
    `/pictures?${Object.entries(queryParams)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => `${key}=${value}`)
      .join("&")}`
  );
};

export const getPicture = async (id: string): Promise<PictureRes> => {
  return api.get(`/pictures/${id}`);
};

export const deleteImage = async (id: string): Promise<void> => {
  return api.delete(`/pictures/${id}`);
};

export const uploadImage = async (image: Blob, filename: string): Promise<Blob> => {
  const formData = new FormData();
  formData.append("image", image, filename);

  return api.post("/pictures", formData);
};
