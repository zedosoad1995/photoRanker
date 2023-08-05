import _ from "underscore";
import request from "supertest";
import { app } from "@/app";
import { UserModel } from "@/models/user";
import { randomizeUser } from "@/tests/helpers/user";
import { UserRole } from "@prisma/client";
import { UserSeeder } from "@/tests/seed/UserSeeder";
import nodemailer, { Transporter, SentMessageInfo } from "nodemailer";
import { adjustDate, calculateAge, formatDate } from "@/helpers/date";
import { MIN_AGE } from "@/constants/user";

jest.mock("nodemailer");
const mockedNodeMailer = nodemailer as jest.Mocked<typeof nodemailer>;

mockedNodeMailer.createTransport.mockReturnValue({
  sendMail: jest.fn().mockResolvedValue({} as SentMessageInfo),
} as unknown as Transporter);

const createUserBody = randomizeUser();

it("creates a new user, 'password' is not returned, isProfileCompleted is true and ieEmailVerified false, 'role' is REGULAR", async () => {
  await UserSeeder.deleteAll();

  const response = await request(app).post("/api/users").send(createUserBody);

  expect(response.status).toEqual(201);
  expect(response.body.user).not.toHaveProperty("password");
  expect(response.body.user.role).toEqual(UserRole.REGULAR);

  const users = await UserModel.findMany();
  expect(users).toHaveLength(1);
  expect(users[0].isProfileCompleted).toBe(true);
  expect(users[0].isEmailVerified).toBe(false);
});

it("Sends mail to email of newly created user", async () => {
  await UserSeeder.deleteAll();

  const response = await request(app).post("/api/users").send(createUserBody);

  expect(response.status).toEqual(201);
  expect(mockedNodeMailer.createTransport().sendMail).toHaveBeenCalledTimes(1);
  expect(mockedNodeMailer.createTransport().sendMail).toHaveBeenCalledWith(
    expect.objectContaining({
      to: createUserBody.email,
    })
  );
});

describe("User Creation fail", () => {
  let mockUserCreate: jest.SpyInstance;
  beforeAll(() => {
    mockUserCreate = jest.spyOn(UserModel, "create").mockRejectedValueOnce(undefined);
  });

  afterAll(() => {
    mockUserCreate.mockRestore();
  });

  it("Does not send email, when User creation fails", async () => {
    await UserSeeder.deleteAll();

    await request(app).post("/api/users").send(createUserBody);

    expect(mockedNodeMailer.createTransport().sendMail).not.toHaveBeenCalled();
  });
});

it("returns 409, when 'email' already exists", async () => {
  await UserSeeder.seedOne({ email: createUserBody.email });

  const response = await request(app).post("/api/users").send(createUserBody);

  expect(response.status).toEqual(409);
});

describe("Test Validation", () => {
  beforeEach(async () => {
    await UserSeeder.deleteAll();
  });

  it("must use valid propriety name", async () => {
    const body = { ...createUserBody, role: UserRole.ADMIN };

    const response = await request(app).post("/api/users").send(body);

    expect(response.status).toEqual(422);
  });

  describe("'name' field", () => {
    it("is required", async () => {
      const body = _.omit(createUserBody, "name");

      const response = await request(app).post("/api/users").send(body);

      expect(response.status).toEqual(422);
    });

    it("is empty", async () => {
      const body = {
        ...createUserBody,
        name: "",
      };

      const response = await request(app).post("/api/users").send(body);

      expect(response.status).toEqual(422);
    });

    it("is too long", async () => {
      const body = {
        ...createUserBody,
        name: "a".repeat(100),
      };

      const response = await request(app).post("/api/users").send(body);

      expect(response.status).toEqual(422);
    });
  });

  describe("'email' field", () => {
    it("is required", async () => {
      const body = _.omit(createUserBody, "email");

      const response = await request(app).post("/api/users").send(body);

      expect(response.status).toEqual(422);
    });

    it("has invalid email format", async () => {
      const body = {
        ...createUserBody,
        email: "invalid",
      };

      const response = await request(app).post("/api/users").send(body);

      expect(response.status).toEqual(422);
    });
  });

  describe("'password' field", () => {
    it("is required", async () => {
      const body = _.omit(createUserBody, "password");

      const response = await request(app).post("/api/users").send(body);

      expect(response.status).toEqual(422);
    });

    it("is too short", async () => {
      const body = {
        ...createUserBody,
        password: "ab",
      };

      const response = await request(app).post("/api/users").send(body);

      expect(response.status).toEqual(422);
    });

    it("is too long", async () => {
      const body = {
        ...createUserBody,
        password: "a".repeat(50),
      };

      const response = await request(app).post("/api/users").send(body);

      expect(response.status).toEqual(422);
    });
  });

  describe("'countryOfOrigin' field", () => {
    it("is required", async () => {
      const body = _.omit(createUserBody, "countryOfOrigin");

      const response = await request(app).post("/api/users").send(body);

      expect(response.status).toEqual(422);
    });

    it("is an invalid country name", async () => {
      const body = {
        ...createUserBody,
        countryOfOrigin: "invalid",
      };

      const response = await request(app).post("/api/users").send(body);

      expect(response.status).toEqual(422);
    });
  });

  describe("'ethnicity' field", () => {
    it("is required", async () => {
      const body = _.omit(createUserBody, "ethnicity");

      const response = await request(app).post("/api/users").send(body);

      expect(response.status).toEqual(422);
    });

    it("is an invalid ethnicity name", async () => {
      const body = {
        ...createUserBody,
        ethnicity: "invalid",
      };

      const response = await request(app).post("/api/users").send(body);

      expect(response.status).toEqual(422);
    });
  });

  describe("'gender' field", () => {
    it("is required", async () => {
      const body = _.omit(createUserBody, "gender");

      const response = await request(app).post("/api/users").send(body);

      expect(response.status).toEqual(422);
    });

    it("is an invalid gender name", async () => {
      const body = {
        ...createUserBody,
        gender: "non-binary",
      };

      const response = await request(app).post("/api/users").send(body);

      expect(response.status).toEqual(422);
    });
  });

  describe("'dateOfBirth' field", () => {
    it("is required", async () => {
      const body = _.omit(createUserBody, "dateOfBirth");

      const response = await request(app).post("/api/users").send(body);

      expect(response.status).toEqual(422);
    });

    it("is has an invalid format, should be yyyy-MM-dd", async () => {
      const body = {
        ...createUserBody,
        dateOfBirth: "1995/01/01",
      };

      const response = await request(app).post("/api/users").send(body);

      expect(response.status).toEqual(422);
    });

    it("is has a valid format, but the date is invalid", async () => {
      const body = {
        ...createUserBody,
        dateOfBirth: "1995-02-30",
      };

      const response = await request(app).post("/api/users").send(body);

      expect(response.status).toEqual(422);
    });

    it("Throws error when user is younger than the minimum allowed age", async () => {
      const body = {
        ...createUserBody,
        dateOfBirth: formatDate(adjustDate(new Date(), { years: -MIN_AGE, days: 1, hours: 1 })),
      };

      const response = await request(app).post("/api/users").send(body);

      expect(response.status).toEqual(422);
    });

    it("Succeds when user has an allowed age", async () => {
      const body = {
        ...createUserBody,
        dateOfBirth: formatDate(adjustDate(new Date(), { years: -MIN_AGE, hours: -1 })),
      };

      const response = await request(app).post("/api/users").send(body);

      expect(response.status).toEqual(201);
    });
  });
});
