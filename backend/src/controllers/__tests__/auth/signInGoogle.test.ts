class OAuth2ClientMock {
  constructor() {}

  async getToken() {}
}

import request from "supertest";
import { app } from "@/app";
import { randomizeUser } from "@/tests/helpers/user";
import _ from "underscore";
import { User } from "@prisma/client";
import { UserSeeder } from "@/tests/seed/UserSeeder";
import { AUTH } from "@/constants/messages";
import axios from "axios";
import { UserModel } from "@/models/user";
const { NO_ACCESS_TOKEN, UNVERIFIED_EMAIL } = AUTH.GOOGLE;

const CODE = "code";
let user: User;
let spyGetToken: jest.SpyInstance;

jest.mock("google-auth-library", () => ({
  OAuth2Client: OAuth2ClientMock,
}));

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

beforeAll(async () => {
  const userData = randomizeUser({
    googleId: "googleId",
  });

  user = await UserSeeder.seedOne(userData);
});

beforeEach(() => {
  spyGetToken = jest.spyOn(OAuth2ClientMock.prototype, "getToken");
});

afterEach(() => {
  spyGetToken.mockRestore();
});

it("Returns 401, when access_token is undefined", async () => {
  spyGetToken.mockResolvedValue({ tokens: { access_token: undefined } });

  const response = await request(app).post("/api/auth/login/google").send({
    code: CODE,
  });

  expect(response.status).toEqual(401);
  expect(response.body.message).toEqual(NO_ACCESS_TOKEN);
});

it("Returns 401, when email is not verified", async () => {
  spyGetToken.mockResolvedValue({ tokens: { access_token: "token" } });
  mockedAxios.get.mockResolvedValue({ data: { email_verified: false } });

  const response = await request(app).post("/api/auth/login/google").send({
    code: CODE,
  });

  expect(response.status).toEqual(401);
  expect(response.body.message).toEqual(UNVERIFIED_EMAIL);
});

it("Returns 401, when user exists, but googleId/sub does not match the existing one", async () => {
  spyGetToken.mockResolvedValue({ tokens: { access_token: "token" } });
  mockedAxios.get.mockResolvedValue({
    data: {
      email: user.email,
      sub: "wrongGoogleId",
      email_verified: true,
    },
  });

  const response = await request(app).post("/api/auth/login/google").send({
    code: CODE,
  });

  expect(response.status).toEqual(401);
});

it("Logs in, returns logged user, and sets cookie", async () => {
  spyGetToken.mockResolvedValue({ tokens: { access_token: "token" } });
  mockedAxios.get.mockResolvedValue({
    data: {
      email: user.email,
      sub: user.googleId,
      email_verified: true,
    },
  });

  const response = await request(app).post("/api/auth/login/google").send({
    code: CODE,
  });

  expect(response.body.user.id).toEqual(user.id);
  expect(response.header).toHaveProperty("set-cookie");
});

it("does not return 'googleId' field", async () => {
  spyGetToken.mockResolvedValue({ tokens: { access_token: "token" } });
  mockedAxios.get.mockResolvedValue({
    data: {
      email: user.email,
      sub: user.googleId,
      email_verified: true,
    },
  });

  const response = await request(app).post("/api/auth/login/google").send({
    code: CODE,
  });

  expect(response.body.user).not.toHaveProperty("googleId");
});

it("Logs in, returns logged user, and sets cookie", async () => {
  spyGetToken.mockResolvedValue({ tokens: { access_token: "token" } });
  mockedAxios.get.mockResolvedValue({
    data: {
      email: user.email,
      sub: user.googleId,
      email_verified: true,
    },
  });

  const response = await request(app).post("/api/auth/login/google").send({
    code: CODE,
  });

  expect(response.body.user.id).toEqual(user.id);
  expect(response.header).toHaveProperty("set-cookie");
});

it("Creates user and sets cookie, when user does not exist. isEmailVerified is set as true", async () => {
  const NEW_EMAIL = "new@email.com";
  const NEW_GOOGLE_ID = "id";

  spyGetToken.mockResolvedValue({ tokens: { access_token: "token" } });
  mockedAxios.get.mockResolvedValue({
    data: {
      name: "Name",
      email: NEW_EMAIL,
      sub: NEW_GOOGLE_ID,
      email_verified: true,
    },
  });

  const response = await request(app).post("/api/auth/login/google").send({
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
  expect(newUser?.googleId).toBe(NEW_GOOGLE_ID);

  expect(response.body.user.email).toEqual(NEW_EMAIL);
  expect(response.header).toHaveProperty("set-cookie");
});

describe("Test Validation", () => {
  describe("'code' field", () => {
    it("is required", async () => {
      const response = await request(app).post("/api/auth/login/google").send({
        code: undefined,
      });

      expect(response.status).toEqual(422);
    });
  });
});
