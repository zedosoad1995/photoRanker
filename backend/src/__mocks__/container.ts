import { Elo } from "@/repositories/rating/elo";
import { Glicko2 } from "@/repositories/rating/glicko2";

export const mainStorageInteractor = {
  saveNewImage: jest.fn(),
  getImageUrl: jest.fn(),
  deleteImage: jest.fn(),
};

export const elo = new Elo();
export const glicko2 = new Glicko2();
