import request from "supertest";
import { app } from "@/app";
import { randomizeUser } from "@/tests/helpers/user";
import _ from "underscore";
import { User } from "@prisma/client";
import { UserSeeder } from "@/tests/seed/UserSeeder";
import { AUTH } from "@/constants/messages";
import axios from "axios";
import { UserModel } from "@/models/user";
const { NO_ACCESS_TOKEN } = AUTH.FACEBOOK;

const CODE = "code";
let user: User;

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

beforeAll(async () => {
  const userData = randomizeUser({
    facebookId: "facebookId",
  });

  user = await UserSeeder.seedOne(userData);
});

it("Returns 401, when access_token is undefined", async () => {
  mockedAxios.get.mockResolvedValueOnce({ data: { access_token: undefined } });

  const response = await request(app).post("/api/auth/login/facebook").send({
    code: CODE,
  });

  expect(response.status).toEqual(401);
  expect(response.body.message).toEqual(NO_ACCESS_TOKEN);
});

it("Returns 401, when user exists, but googleId/sub does not match the existing one", async () => {
  mockedAxios.get.mockResolvedValueOnce({ data: { access_token: "token" } });
  mockedAxios.get.mockResolvedValueOnce({
    data: { email: user.email, id: "wrongFacebookId" },
  });

  const response = await request(app).post("/api/auth/login/facebook").send({
    code: CODE,
  });

  expect(response.status).toEqual(401);
});

it("Logs in, returns logged user, and sets cookie", async () => {
  mockedAxios.get.mockResolvedValueOnce({ data: { access_token: "token" } });
  mockedAxios.get.mockResolvedValueOnce({
    data: { email: user.email, id: user.facebookId },
  });

  const response = await request(app).post("/api/auth/login/facebook").send({
    code: CODE,
  });

  expect(response.body.user.id).toEqual(user.id);
  expect(response.header).toHaveProperty("set-cookie");
});

it("does not return 'facebookId' field", async () => {
  mockedAxios.get.mockResolvedValueOnce({ data: { access_token: "token" } });
  mockedAxios.get.mockResolvedValueOnce({
    data: { email: user.email, id: user.facebookId },
  });

  const response = await request(app).post("/api/auth/login/facebook").send({
    code: CODE,
  });

  expect(response.body.user).not.toHaveProperty("facebookId");
});

it("Creates user and sets cookie, when user does not exist. isEmailVerified is set as true", async () => {
  const NEW_EMAIL = "new@email.com";
  const NEW_FACEBOOK_ID = "id";

  mockedAxios.get.mockResolvedValueOnce({ data: { access_token: "token" } });
  mockedAxios.get.mockResolvedValueOnce({
    data: { email: NEW_EMAIL, id: NEW_FACEBOOK_ID, name: "Name" },
  });

  const response = await request(app).post("/api/auth/login/facebook").send({
    code: CODE,
  });

  expect(response.status).toEqual(201);

  const newUser = await UserModel.findUnique({
    where: {
      email: NEW_EMAIL,
    },
  });

  expect(newUser?.isProfileCompleted).toBe(false);
  expect(newUser?.isEmailVerified).toBe(true);
  expect(newUser?.facebookId).toBe(NEW_FACEBOOK_ID);

  expect(response.body.user.email).toEqual(NEW_EMAIL);
  expect(response.header).toHaveProperty("set-cookie");
});

describe("Test Validation", () => {
  describe("'code' field", () => {
    it("is required", async () => {
      const response = await request(app).post("/api/auth/login/facebook").send({
        code: undefined,
      });

      expect(response.status).toEqual(422);
    });
  });
});
