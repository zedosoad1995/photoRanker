import request from "supertest";
import { app } from "@/app";
import { loginAdmin, loginRegular } from "@/tests/helpers/user";
import { UserSeeder } from "@/tests/seed/UserSeeder";
import { UserModel } from "@/models/user";
import { User } from "@prisma/client";

let userId: string;

beforeAll(async () => {
  const user = await UserSeeder.seedOne();
  userId = user.id;
});

describe("Unauthorized", () => {
  it("returns 401, when no user is authenticated", async () => {
    const response = await request(app).get(`/api/users/${userId}`).send();

    expect(response.status).toEqual(401);
  });
});

describe("Regular Logged User", () => {
  let regularCookie: string;
  let regularUser: User;

  beforeAll(async () => {
    const res = await loginRegular();
    regularCookie = res.cookie;
    regularUser = res.user;
  });

  beforeEach(async () => {
    await UserModel.update({
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
      .get(`/api/users/${userId}`)
      .set("Cookie", regularCookie)
      .send();

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
      .get(`/api/users/${userId}`)
      .set("Cookie", regularCookie)
      .send();

    expect(response.status).toEqual(403);
  });

  it("returns 403, when passed id does not correspond to logged user id", async () => {
    const response = await request(app)
      .get(`/api/users/${userId}`)
      .set("Cookie", regularCookie)
      .send();

    expect(response.status).toEqual(403);
  });

  it("returns user, when passed id corresponds to logged user id", async () => {
    const response = await request(app)
      .get(`/api/users/${regularUser!.id}`)
      .set("Cookie", regularCookie)
      .send();

    expect(response.status).toEqual(200);
  });
});

describe("Admin Logged User", () => {
  let adminCookie: string;

  beforeAll(async () => {
    const res = await loginAdmin();
    adminCookie = res.cookie;
  });

  it("returns 404, when user id does not exist", async () => {
    const response = await request(app)
      .get("/api/users/doesnotexist")
      .set("Cookie", adminCookie)
      .send();

    expect(response.status).toEqual(404);
  });

  it("returns user", async () => {
    const response = await request(app)
      .get(`/api/users/${userId}`)
      .set("Cookie", adminCookie)
      .send();

    expect(response.status).toEqual(200);
    expect(response.body.user.id).toEqual(userId);
  });

  it("does not return 'password' field", async () => {
    const response = await request(app)
      .get(`/api/users/${userId}`)
      .set("Cookie", adminCookie)
      .send();

    expect(response.body.user).not.toHaveProperty("password");
  });
});
