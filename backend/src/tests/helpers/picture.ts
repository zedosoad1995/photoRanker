import { TEST_IMAGES_FOLDER_PATH } from "@/constants/picture";
import { faker } from "@faker-js/faker";
import { Prisma } from "@prisma/client";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";

export const randomizePicture = (
  data: Partial<Prisma.PictureCreateManyInput> = {}
) => ({
  filepath: `${TEST_IMAGES_FOLDER_PATH}/${crypto
    .randomBytes(18)
    .toString("hex")}.${faker.helpers.arrayElement(["jpg", "png"])}`,
  elo: faker.number.float({ min: 0, max: 4000 }),
  numVotes: faker.number.int({ min: 0, max: 50_000 }),
  userId: uuidv4(),
  ...data,
});
