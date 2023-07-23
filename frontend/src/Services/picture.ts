import api from "./index";
import { IGetManyPictures, IGetPicture } from "../../../backend/src/types/picture";

export const getManyPictures = async (): Promise<IGetManyPictures> => {
  return api.get("/pictures");
};

export const getPicture = async (id: string): Promise<IGetPicture> => {
  return api.get(`/pictures/${id}`);
};

export const getImage = async (imagePath: string): Promise<Blob> => {
  return api.get(`/pictures/image/${imagePath}`, { responseType: "blob" });
};

export const uploadImage = async (image: Blob, filename: string): Promise<Blob> => {
  const formData = new FormData();
  formData.append("image", image, filename);

  return api.post("/pictures", formData);
};
