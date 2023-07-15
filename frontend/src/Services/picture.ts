import api from "./index";
import { IGetManyPictures } from "../../../backend/src/types/picture";

export const getManyPictures = async (): Promise<IGetManyPictures> => {
  return api.get("/pictures");
};

export const getImage = async (imagePath: string): Promise<Blob> => {
  return api.get(`/pictures/image/${imagePath}`, { responseType: "blob" });
};
