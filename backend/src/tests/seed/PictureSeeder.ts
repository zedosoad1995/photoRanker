import { PictureModel } from "@/models/picture";
import { Prisma } from "@prisma/client";
import _ from "underscore";
import { randomizePicture } from "../helpers/picture";

interface SeedInput {
  data?: Partial<Prisma.PictureCreateManyInput> | Partial<Prisma.PictureCreateManyInput>[];
  numRepeat?: number;
}

export class PictureSeeder {
  async seed(
    { data = {}, numRepeat = 1 }: SeedInput = { data: {}, numRepeat: 1 }
  ) {
    await this.deleteAll();
    return this.createMany({ data, numRepeat });
  }

  async createMany(
    { data = {}, numRepeat = 1 }: SeedInput = { data: {}, numRepeat: 1 }
  ) {
    if (Array.isArray(data)) {
      await PictureModel.createMany({
        data: data.map((row) => ({
          ...randomizePicture(),
          ...row,
        })),
      });

      return PictureModel.findMany();
    }

    await PictureModel.createMany({
      data: _.times(numRepeat, () => ({
        ...randomizePicture(),
        ...data,
      })),
    });

    return PictureModel.findMany();
  }

  async deleteAll() {
    await PictureModel.deleteMany();
  }
}
