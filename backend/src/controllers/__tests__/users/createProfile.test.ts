import request from "supertest";
import { app } from "@/app";
import { UserModel } from "@/models/user";
import { loginAdmin, loginRegular, randomizeUser } from "@/tests/helpers/user";
import _ from "underscore";
import { UserRole } from "@prisma/client";
import { UserSeeder } from "@/tests/seed/UserSeeder";

const updateProfileBody = _.pick(
  randomizeUser(),
  "countryOfOrigin",
  "ethnicity",
  "gender",
  "dateOfBirth"
);

let userId: string;
let adminCookie: string;
let regularCookie: string;

beforeAll(async () => {
  const user = await UserSeeder.seedOne({
    gender: null,
    countryOfOrigin: null,
    dateOfBirth: null,
    ethnicity: null,
    isProfileCompleted: false,
    password: null,
  });

  userId = user.id;
});

describe("Unauthorized", () => {
  it("returns 401, when no user is authenticated", async () => {
    const response = await request(app).patch(`/api/users/profile/${userId}`).send();

    expect(response.status).toEqual(401);
  });
});

describe("Admin Logged User", () => {
  beforeAll(async () => {
    const res = await loginAdmin();
    adminCookie = res.cookie;
  });

  it("edits user, 'password' is not returned", async () => {
    const response = await request(app)
      .patch(`/api/users/profile/${userId}`)
      .set("Cookie", adminCookie)
      .send(updateProfileBody);

    expect(response.status).toEqual(200);
    expect(response.body.user).not.toHaveProperty("password");

    const user = await UserModel.findUnique({
      where: {
        id: userId,
      },
    });
    expect(user).toMatchObject(updateProfileBody);
  });

  it("returns 404, when user id does not exist", async () => {
    const response = await request(app)
      .patch("/api/users/profile/doesnotexist")
      .set("Cookie", adminCookie)
      .send(updateProfileBody);

    expect(response.status).toEqual(404);
  });

  it("returns 400, when profile is completed", async () => {
    const userCompleted = await UserSeeder.createOne({
      isProfileCompleted: true,
      password: null,
    });

    const response = await request(app)
      .patch(`/api/users/profile/${userCompleted.id}`)
      .set("Cookie", adminCookie)
      .send(updateProfileBody);

    expect(response.status).toEqual(400);
  });

  describe("Test Validation", () => {
    describe("'countryOfOrigin' field", () => {
      it("is required", async () => {
        const body = _.omit(updateProfileBody, "countryOfOrigin");

        const response = await request(app)
          .patch(`/api/users/profile/${userId}`)
          .set("Cookie", adminCookie)
          .send(body);

        expect(response.status).toEqual(422);
      });

      it("is an invalid country name", async () => {
        const body = {
          ...updateProfileBody,
          countryOfOrigin: "invalid",
        };

        const response = await request(app)
          .patch(`/api/users/profile/${userId}`)
          .set("Cookie", adminCookie)
          .send(body);

        expect(response.status).toEqual(422);
      });
    });

    describe("'ethnicity' field", () => {
      it("is required", async () => {
        const body = _.omit(updateProfileBody, "ethnicity");

        const response = await request(app)
          .patch(`/api/users/profile/${userId}`)
          .set("Cookie", adminCookie)
          .send(body);

        expect(response.status).toEqual(422);
      });

      it("is an invalid ethnicity name", async () => {
        const body = {
          ...updateProfileBody,
          ethnicity: "invalid",
        };

        const response = await request(app)
          .patch(`/api/users/profile/${userId}`)
          .set("Cookie", adminCookie)
          .send(body);

        expect(response.status).toEqual(422);
      });
    });

    describe("'gender' field", () => {
      it("is required", async () => {
        const body = _.omit(updateProfileBody, "gender");

        const response = await request(app)
          .patch(`/api/users/profile/${userId}`)
          .set("Cookie", adminCookie)
          .send(body);

        expect(response.status).toEqual(422);
      });

      it("is an invalid gender name", async () => {
        const body = {
          gender: "non-binary",
        };

        const response = await request(app)
          .patch(`/api/users/profile/${userId}`)
          .set("Cookie", adminCookie)
          .send(body);

        expect(response.status).toEqual(422);
      });
    });

    describe("'dateOfBirth' field", () => {
      it("is required", async () => {
        const body = _.omit(updateProfileBody, "dateOfBirth");

        const response = await request(app)
          .patch(`/api/users/profile/${userId}`)
          .set("Cookie", adminCookie)
          .send(body);

        expect(response.status).toEqual(422);
      });

      it("is has an invalid format, should be yyyy-MM-dd", async () => {
        const body = {
          dateOfBirth: "2020/01/01",
        };

        const response = await request(app)
          .patch(`/api/users/profile/${userId}`)
          .set("Cookie", adminCookie)
          .send(body);

        expect(response.status).toEqual(422);
      });

      it("is has a valid format, but the date is invalid", async () => {
        const body = {
          dateOfBirth: "2020-02-30",
        };

        const response = await request(app)
          .patch(`/api/users/profile/${userId}`)
          .set("Cookie", adminCookie)
          .send(body);

        expect(response.status).toEqual(422);
      });
    });
  });
});

describe("Regular Logged User", () => {
  beforeAll(async () => {
    const res = await loginRegular();
    regularCookie = res.cookie;
  });

  it("edits user, 'password' is not returned", async () => {
    const response = await request(app)
      .patch(`/api/users/profile/${userId}`)
      .set("Cookie", regularCookie)
      .send(updateProfileBody);

    expect(response.status).toEqual(200);
    expect(response.body.user).not.toHaveProperty("password");

    const user = await UserModel.findUnique({
      where: {
        id: userId,
      },
    });
    expect(user).toMatchObject(updateProfileBody);
  });
});
