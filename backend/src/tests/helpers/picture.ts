import { IMAGES_FOLDER_PATH } from "@/constants/picture";
import { faker } from "@faker-js/faker";
import { Prisma } from "@prisma/client";
import crypto from "crypto";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

export const randomizePicture = (data: Partial<Prisma.PictureCreateManyInput> = {}) => {
  const INTERMEDIATE_FOLDER = "2022";

  const intermediateFolder = path.join(IMAGES_FOLDER_PATH, INTERMEDIATE_FOLDER);
  if (!fs.existsSync(intermediateFolder)) {
    fs.mkdirSync(intermediateFolder);
  }

  const imagePath = path.join(
    INTERMEDIATE_FOLDER,
    `${crypto.randomBytes(18).toString("hex")}.${faker.helpers.arrayElement(["jpg", "png"])}`,
  );

  // Create file
  const fullPath = path.resolve(IMAGES_FOLDER_PATH, imagePath);
  fs.writeFileSync(fullPath, "");

  return {
    filepath: encodeURI(imagePath.replace(/\//g, "\\")),
    rating: faker.number.float({ min: 0, max: 4000 }),
    ratingDeviation: faker.number.float({ min: 20, max: 700 }),
    volatility: faker.number.float({ min: 1e-6, max: 0.1 }),
    numVotes: faker.number.int({ min: 0, max: 50_000 }),
    age: faker.number.int({ min: 18, max: 70 }),
    userId: uuidv4(),
    ...data,
  };
};
