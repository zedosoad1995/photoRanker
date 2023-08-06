import { IGetManyPictures, PictureRes } from "@/Types/picture";
import api from "./index";

export const getManyPictures = async (userId?: string): Promise<IGetManyPictures> => {
  return api.get(`/pictures?userId=${userId}`);
};

export const getPicture = async (id: string): Promise<PictureRes> => {
  return api.get(`/pictures/${id}`);
};

export const getImage = async (imagePath: string): Promise<Blob> => {
  return api.get(`/pictures/image/${imagePath}`, { responseType: "blob" });
};

export const deleteImage = async (id: string): Promise<void> => {
  return api.delete(`/pictures/${id}`);
};

export const uploadImage = async (image: Blob, filename: string): Promise<Blob> => {
  const formData = new FormData();
  formData.append("image", image, filename);

  return api.post("/pictures", formData);
};
