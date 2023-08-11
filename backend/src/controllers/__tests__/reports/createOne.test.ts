import request from "supertest";
import { app } from "@/app";
import { UserModel } from "@/models/user";
import { loginAdmin, loginRegular } from "@/tests/helpers/user";
import { User } from "@prisma/client";
import { PictureSeeder } from "@/tests/seed/PictureSeeder";
import { MatchSeeder } from "@/tests/seed/MatchSeeder";
import { UserSeeder } from "@/tests/seed/UserSeeder";

describe("Unauthorized", () => {
  it("returns 401, when no user is authenticated", async () => {
    const response = await request(app).post("/api/reports").send();

    expect(response.status).toEqual(401);
  });
});

describe("Regular Logged User", () => {
  let regularCookie: string;
  let regularUser: User;
  let pictureId: string;

  beforeAll(async () => {
    const res = await loginRegular();
    regularCookie = res.cookie;
    regularUser = res.user;

    const user = await UserSeeder.createOne();

    const picture = await PictureSeeder.seedOne({
      userId: user.id,
    });
    pictureId = picture.id;
  });

  beforeEach(() => {
    return UserModel.update({
      data: {
        isProfileCompleted: true,
        isEmailVerified: true,
      },
      where: {
        id: regularUser.id,
      },
    });
  });

  it("returns 403, when isProfileCompleted is false", async () => {
    await UserModel.update({
      data: {
        isProfileCompleted: false,
      },
      where: {
        id: regularUser.id,
      },
    });

    const response = await request(app)
      .post("/api/reports")
      .set("Cookie", regularCookie)
      .send({ pictureId });

    expect(response.status).toEqual(403);
  });

  it("returns 403, when isEmailVerified is false", async () => {
    await UserModel.update({
      data: {
        isEmailVerified: false,
      },
      where: {
        id: regularUser.id,
      },
    });

    const response = await request(app)
      .post("/api/reports")
      .set("Cookie", regularCookie)
      .send({ pictureId });

    expect(response.status).toEqual(403);
  });

  it("throws error when picture does not belong to logged user active match", async () => {
    await MatchSeeder.seedOne({
      pictures: {
        connect: {
          id: pictureId,
        },
      },
    });

    const response = await request(app)
      .post("/api/reports")
      .set("Cookie", regularCookie)
      .send({ pictureId });

    expect(response.status).toEqual(403);
  });

  it("Creates report when picture belong to logged user active match", async () => {
    await MatchSeeder.seedOne({
      pictures: {
        connect: {
          id: pictureId,
        },
      },
      activeUser: {
        connect: {
          id: regularUser.id,
        },
      },
    });

    const response = await request(app)
      .post("/api/reports")
      .set("Cookie", regularCookie)
      .send({ pictureId });

    expect(response.status).toEqual(201);
  });
});

describe("Admin Logged User", () => {
  let adminCookie: string;
  let adminUser: User;
  let pictureId: string;

  beforeAll(async () => {
    const res = await loginAdmin();
    adminCookie = res.cookie;
    adminUser = res.user;

    const user = await UserSeeder.createOne();

    const picture = await PictureSeeder.seedOne({
      userId: user.id,
    });
    pictureId = picture.id;
  });

  beforeEach(() => {
    return UserModel.update({
      data: {
        isProfileCompleted: true,
        isEmailVerified: true,
      },
      where: {
        id: adminUser.id,
      },
    });
  });

  it("Creates report, no matter which picture", async () => {
    const response = await request(app)
      .post("/api/reports")
      .set("Cookie", adminCookie)
      .send({ pictureId });

    expect(response.status).toEqual(201);
  });
});
