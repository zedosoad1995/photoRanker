import { faker } from "@faker-js/faker";
import { Prisma } from "@prisma/client";
import crypto from "crypto"

export const randomizePicture = (data: Partial<Prisma.PictureCreateInput> = {}) => ({
  filepath: `storage/testImages/${crypto.randomBytes(18).toString('hex')}.${faker.helpers.arrayElement(["jpg", "png"])}`,
  elo: faker.number.float({min: 0, max: 4000}),
  numVotes: faker.number.int({min: 0, max: 50_000}),
  ...data,
});