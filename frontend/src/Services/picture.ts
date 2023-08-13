import { IGetManyPictures, PictureRes } from "@/Types/picture";
import api from "./index";

export const getManyPictures = async (
  queryParams: {
    userId?: string;
    hasReport?: boolean;
    belongsToMe?: boolean;
    isBanned?: boolean;
    orderBy?: string;
    orderByDir?: string;
  } = {}
): Promise<IGetManyPictures> => {
  return api.get(
    `/pictures?${Object.entries(queryParams)
      .map(([key, value]) => `${key}=${value}`)
      .join("&")}`
  );
};

export const getPicture = async (id: string): Promise<PictureRes> => {
  return api.get(`/pictures/${id}`);
};

export const getImage = async (imagePath: string): Promise<{ url: string }> => {
  return api.get(`/pictures/image/${imagePath}`);
};

export const deleteImage = async (id: string): Promise<void> => {
  return api.delete(`/pictures/${id}`);
};

export const uploadImage = async (image: Blob, filename: string): Promise<Blob> => {
  const formData = new FormData();
  formData.append("image", image, filename);

  return api.post("/pictures", formData);
};
