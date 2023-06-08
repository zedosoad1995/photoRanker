import request from "supertest";
import { app } from "@/app";
import { Seeder } from "@/tests/seed/Seeder";
import { UserModel } from "@/models/user";
import { randomizeUser } from "@/tests/helpers/user";
import _ from "underscore";
import { UserRole } from "@prisma/client";

const updateUserBody = _.omit(randomizeUser(), "email");

let userId: string;

beforeAll(async () => {
  const user = await Seeder("User")?.seed({ numRepeat: 1 });

  if (user) {
    userId = user[0].id;
  }
});

it("edits user, 'password' is not returned", async () => {
  const response = await request(app)
    .patch(`/api/users/${userId}`)
    .send(updateUserBody);

  expect(response.status).toEqual(200);
  expect(response.body.user).not.toHaveProperty("password");

  const user = await UserModel.findUnique({
    where: {
      id: userId,
    },
  });
  expect(user?.name).toBe(updateUserBody.name);
});

it("returns 404, when user id does not exist", async () => {
  const response = await request(app)
    .patch("/api/users/doesnotexist")
    .send(updateUserBody);

  expect(response.status).toEqual(404);
});

describe("Test Validation", () => {
  it("must use valid propriety name", async () => {
    const body = { role: UserRole.ADMIN };

    const response = await request(app)
      .patch(`/api/users/${userId}`)
      .send(body);

    expect(response.status).toEqual(422);
  });

  it("cannot update 'email' field", async () => {
    const body = { email: "random@email.com" };

    const response = await request(app)
      .patch(`/api/users/${userId}`)
      .send(body);

    expect(response.status).toEqual(422);
  });

  describe("'name' field", () => {
    it("is empty", async () => {
      const body = {
        name: "",
      };

      const response = await request(app)
        .patch(`/api/users/${userId}`)
        .send(body);

      expect(response.status).toEqual(422);
    });

    it("is too long", async () => {
      const body = {
        name: "a".repeat(100),
      };

      const response = await request(app)
        .patch(`/api/users/${userId}`)
        .send(body);

      expect(response.status).toEqual(422);
    });
  });

  describe("'password' field", () => {
    it("is too short", async () => {
      const body = {
        password: "ab",
      };

      const response = await request(app)
        .patch(`/api/users/${userId}`)
        .send(body);

      expect(response.status).toEqual(422);
    });

    it("is too long", async () => {
      const body = {
        password: "a".repeat(50),
      };

      const response = await request(app)
        .patch(`/api/users/${userId}`)
        .send(body);

      expect(response.status).toEqual(422);
    });
  });

  describe("'countryOfOrigin' field", () => {
    it("is an invalid country name", async () => {
      const body = {
        countryOfOrigin: "invalid",
      };

      const response = await request(app)
        .patch(`/api/users/${userId}`)
        .send(body);

      expect(response.status).toEqual(422);
    });
  });

  describe("'ethnicity' field", () => {
    it("is an invalid ethnicity name", async () => {
      const body = {
        ethnicity: "invalid",
      };

      const response = await request(app)
        .patch(`/api/users/${userId}`)
        .send(body);

      expect(response.status).toEqual(422);
    });
  });

  describe("'dateOfBirth' field", () => {
    it("is has an invalid format, should be yyyy-MM-dd", async () => {
      const body = {
        dateOfBirth: "2020/01/01",
      };

      const response = await request(app)
        .patch(`/api/users/${userId}`)
        .send(body);

      expect(response.status).toEqual(422);
    });

    it("is has a valid format, but the date is invalid", async () => {
      const body = {
        dateOfBirth: "2020-02-30",
      };

      const response = await request(app)
        .patch(`/api/users/${userId}`)
        .send(body);

      expect(response.status).toEqual(422);
    });
  });
});
