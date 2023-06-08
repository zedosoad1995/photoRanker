import { UserModel } from "@/models/user";
import { Prisma } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { formatDate } from "@/helpers/date";
import { ETHNICITY } from "@/constants/user";
import { COUNTRIES } from "@/constants/user";
import _ from "underscore";

const randomizeUser = () => ({
  email: faker.internet.email(),
  name: faker.person.fullName(),
  dateOfBirth: formatDate(
    faker.date.birthdate({
      min: 18,
      max: 100,
      mode: "age",
    })
  ),
  ethnicity: faker.helpers.arrayElement(ETHNICITY),
  countryOfOrigin: faker.helpers.arrayElement(COUNTRIES),
  password: faker.internet.password(),
});

interface SeedInput {
  data?: Partial<Prisma.UserCreateInput> | Partial<Prisma.UserCreateInput>[];
  numRepeat?: number;
}

export class UserSeeder {
  async seed(
    { data = {}, numRepeat = 1 }: SeedInput = { data: {}, numRepeat: 1 }
  ) {
    await UserModel.deleteMany();

    if (Array.isArray(data)) {
      await UserModel.createMany({
        data: data.map((row) => ({
          ...randomizeUser(),
          ...row,
        })),
      });

      return UserModel.findMany();
    }

    await UserModel.createMany({
      data: _.times(numRepeat, () => ({
        ...randomizeUser(),
        ...data,
      })),
    });

    return UserModel.findMany();
  }
}
