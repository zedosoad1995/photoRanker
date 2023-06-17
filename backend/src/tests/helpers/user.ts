import { faker } from "@faker-js/faker";
import { formatDate } from "@/helpers/date";
import { ETHNICITY } from "@/constants/user";
import { COUNTRIES } from "@/constants/user";
import { Prisma, UserRole } from "@prisma/client";
import { UserModel } from "@/models/user";
import { hashPassword } from "@/helpers/password";
import { app } from "@/app";
import request from "supertest";

export const randomizeUser = (data: Partial<Prisma.UserCreateInput> = {}) => ({
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
  ...data,
});

export const loginUser = async (role: UserRole) => {
  const password = "Password";

  const adminUser = await UserModel.create({
    data: randomizeUser({
      role,
      password: await hashPassword(password),
    }),
  });

  const res = await request(app).post("/api/auth").send({
    email: adminUser.email,
    password: password,
  });

  const cookie = res.header["set-cookie"][0].split(";")[0];

  return { cookie, user: res.body.user };
};

export const loginRegular = async () => {
  return loginUser(UserRole.REGULAR);
};

export const loginAdmin = async () => {
  return loginUser(UserRole.ADMIN);
};
