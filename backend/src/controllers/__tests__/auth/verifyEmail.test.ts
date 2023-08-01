import request from "supertest";
import { app } from "@/app";
import { getDateInXHours } from "@/helpers/date";
import { UserSeeder } from "@/tests/seed/UserSeeder";
import { UserModel } from "@/models/user";

const TOKEN = "token";

it("returns 400, when no user exists with given token", async () => {
  const response = await request(app).post("/api/auth/verification/invalid-token").send();

  expect(response.status).toEqual(400);
});

it("returns 400, when user exists but token expiration date not", async () => {
  await UserSeeder.seedOne({
    verificationToken: TOKEN,
    isEmailVerified: false,
  });

  const response = await request(app).post(`/api/auth/verification/${TOKEN}`).send();

  expect(response.status).toEqual(400);
});

it("returns 400, current date is greater than token expiration date", async () => {
  console.log(getDateInXHours(-1));
  await UserSeeder.seedOne({
    verificationToken: TOKEN,
    verificationTokenExpiration: getDateInXHours(-1),
    isEmailVerified: false,
  });

  const response = await request(app).post(`/api/auth/verification/${TOKEN}`).send();

  expect(response.status).toEqual(400);
});

it("returns 204, and updates email to verified, and nullifies token, when token is valid and has not expired", async () => {
  const seededUser = await UserSeeder.seedOne({
    verificationToken: TOKEN,
    verificationTokenExpiration: getDateInXHours(1),
    isEmailVerified: false,
  });

  const response = await request(app).post(`/api/auth/verification/${TOKEN}`).send();

  expect(response.status).toEqual(204);

  const user = await UserModel.findUnique({
    where: {
      id: seededUser.id,
    },
  });

  expect(user?.isEmailVerified).toEqual(true);
  expect(user?.verificationToken).toBeFalsy();
  expect(user?.verificationTokenExpiration).toBeFalsy();
});

it("returns 400, when email has already been verified", async () => {
  await UserSeeder.seedOne({
    verificationToken: TOKEN,
    verificationTokenExpiration: getDateInXHours(1),
    isEmailVerified: true,
  });

  const response = await request(app).post(`/api/auth/verification/${TOKEN}`).send();

  expect(response.status).toEqual(400);
});
