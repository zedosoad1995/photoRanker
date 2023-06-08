import request from "supertest";
import { app } from "@/app";
import { Seeder } from "@/tests/seed/Seeder";
import { UserModel } from "@/models/user";
import { randomizeUser } from "@/tests/helpers/user";
import _ from "underscore";

const createUserBody = randomizeUser();

it("creates a new user, 'password' is not returned", async () => {
  await Seeder("User")?.deleteAll();

  const response = await request(app).post("/api/users").send(createUserBody);

  expect(response.status).toEqual(201);
  expect(response.body.user).not.toHaveProperty("password");

  const numUsers = await UserModel.count();
  expect(numUsers).toBe(1);
});

it("return 409, when 'email' already exists", async () => {
  await Seeder("User")?.seed({ data: { email: createUserBody.email } });

  const response = await request(app).post("/api/users").send(createUserBody);

  expect(response.status).toEqual(409);
});

describe("Test Validation", () => {
  beforeEach(() => {
    return Seeder("User")?.deleteAll();
  });

  it("must use valid propriety name", async () => {
    const body = { ...createUserBody, invalidProp: "" };

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

  describe("'dateOfBirth' field", () => {
    it("is required", async () => {
      const body = _.omit(createUserBody, "dateOfBirth");

      const response = await request(app).post("/api/users").send(body);

      expect(response.status).toEqual(422);
    });

    it("is has an invalid format, should be yyyy-MM-dd", async () => {
      const body = {
        ...createUserBody,
        dateOfBirth: "2020/01/01",
      };

      const response = await request(app).post("/api/users").send(body);

      expect(response.status).toEqual(422);
    });

    it("is has a valid format, but the date is invalid", async () => {
      const body = {
        ...createUserBody,
        dateOfBirth: "2020-02-30",
      };

      const response = await request(app).post("/api/users").send(body);

      expect(response.status).toEqual(422);
    });
  });
});
