import request from "supertest";
import { app } from "@/app";
import { UserModel } from "@/models/user";
import { randomizeUser } from "@/tests/helpers/user";
import _ from "underscore";
import { User } from "@prisma/client";
import { hashPassword } from "@/helpers/password";
import { UserSeeder } from "@/tests/seed/UserSeeder";

const PASSWORD = "Password";
let user: User;

beforeAll(async () => {
  const userData = randomizeUser({
    password: await hashPassword(PASSWORD),
  });

  user = await UserModel.create({
    data: userData,
  });

  const users = await UserSeeder.seed({ data: userData });
  if (users) {
    user = users[0];
  }
});

it("Logs in, returns logged user, and sets cookie", async () => {
  const response = await request(app).post("/api/auth").send({
    email: user.email,
    password: PASSWORD,
  });

  expect(response.body.user.id).toEqual(user.id);
  expect(response.header).toHaveProperty("set-cookie");
});

it("Returns 401, when email does not exist", async () => {
  const response = await request(app).post("/api/auth").send({
    email: "random@email.com",
    password: PASSWORD,
  });

  expect(response.status).toEqual(401);
});

it("Returns 401, when password is wrong", async () => {
  const response = await request(app).post("/api/auth").send({
    email: user.email,
    password: "WrongPass",
  });

  expect(response.status).toEqual(401);
});

describe("Test Validation", () => {
  describe("'email' field", () => {
    it("is required", async () => {
      const response = await request(app).post("/api/auth").send({
        password: PASSWORD,
      });

      expect(response.status).toEqual(422);
    });
  });

  describe("'password' field", () => {
    it("is required", async () => {
      const response = await request(app).post("/api/auth").send({
        email: user.email,
      });

      expect(response.status).toEqual(422);
    });
  });
});
