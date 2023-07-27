class OAuth2ClientMock {
  constructor() {}

  async getToken() {}

  async getTokenInfo() {}
}

import request from "supertest";
import { app } from "@/app";
import { randomizeUser } from "@/tests/helpers/user";
import _ from "underscore";
import { User } from "@prisma/client";
import { hashPassword } from "@/helpers/password";
import { UserSeeder } from "@/tests/seed/UserSeeder";
import { AUTH } from "@/constants/messages";
const { NO_ACCESS_TOKEN, UNVERIFIED_EMAIL, NON_EXISTING_USER } = AUTH.GOOGLE;

const CODE = "code";
const PASSWORD = "Password";
let user: User;
let spyGetToken: jest.SpyInstance;
let spyGetTokenInfo: jest.SpyInstance;

jest.mock("google-auth-library", () => ({
  OAuth2Client: OAuth2ClientMock,
}));

beforeAll(async () => {
  const userData = randomizeUser({
    password: await hashPassword(PASSWORD),
  });

  user = await UserSeeder.seedOne(userData);
});

beforeEach(() => {
  spyGetToken = jest.spyOn(OAuth2ClientMock.prototype, "getToken");
  spyGetTokenInfo = jest.spyOn(OAuth2ClientMock.prototype, "getTokenInfo");
});

afterEach(() => {
  spyGetToken.mockRestore();
  spyGetTokenInfo.mockRestore();
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
  spyGetTokenInfo.mockResolvedValue({ email_verified: false });

  const response = await request(app).post("/api/auth/login/google").send({
    code: CODE,
  });

  expect(response.status).toEqual(401);
  expect(response.body.message).toEqual(UNVERIFIED_EMAIL);
});

it("Returns 401, when user does not exist", async () => {
  spyGetToken.mockResolvedValue({ tokens: { access_token: "token" } });
  spyGetTokenInfo.mockResolvedValue({
    email: "doesNotExists",
    sub: "sub",
    email_verified: true,
  });

  const response = await request(app).post("/api/auth/login/google").send({
    code: CODE,
  });

  expect(response.status).toEqual(401);
  expect(response.body.message).toEqual(NON_EXISTING_USER);
});

it("Returns 401, when user does not exist", async () => {
  spyGetToken.mockResolvedValue({ tokens: { access_token: "token" } });
  spyGetTokenInfo.mockResolvedValue({
    email: "doesNotExists",
    sub: "sub",
    email_verified: true,
  });

  const response = await request(app).post("/api/auth/login/google").send({
    code: CODE,
  });

  expect(response.status).toEqual(401);
  expect(response.body.message).toEqual(NON_EXISTING_USER);
});

it("Logs in, returns logged user, and sets cookie", async () => {
  spyGetToken.mockResolvedValue({ tokens: { access_token: "token" } });
  spyGetTokenInfo.mockResolvedValue({
    email: user.email,
    sub: user.googleId,
    email_verified: true,
  });

  const response = await request(app).post("/api/auth/login/google").send({
    code: CODE,
  });

  expect(response.body.user.id).toEqual(user.id);
  expect(response.header).toHaveProperty("set-cookie");
});

it("does not return 'password' field", async () => {
  spyGetToken.mockResolvedValue({ tokens: { access_token: "token" } });
  spyGetTokenInfo.mockResolvedValue({
    email: user.email,
    sub: user.googleId,
    email_verified: true,
  });

  const response = await request(app).post("/api/auth/login/google").send({
    code: CODE,
  });

  expect(response.body.user).not.toHaveProperty("password");
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
