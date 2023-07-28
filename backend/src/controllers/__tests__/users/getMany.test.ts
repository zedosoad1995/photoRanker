import request from "supertest";
import { app } from "@/app";
import { loginAdmin, loginRegular } from "@/tests/helpers/user";
import { UserSeeder } from "@/tests/seed/UserSeeder";
import { User } from "@prisma/client";
import { UserModel } from "@/models/user";

const NUM_USERS = 10;

let adminCookie: string;
let adminUser: User;

describe("Unauthorized", () => {
  it("returns 401, when no user is authenticated", async () => {
    const response = await request(app).get("/api/users").send();

    expect(response.status).toEqual(401);
  });

  it("returns 403, when logged user is not ADMIN", async () => {
    const { cookie } = await loginRegular();

    const response = await request(app).get("/api/users").set("Cookie", cookie).send();

    expect(response.status).toEqual(403);
  });
});

describe("Admin Logged User", () => {
  beforeAll(async () => {
    await UserSeeder.seedMany({ numRepeat: NUM_USERS });
    const res = await loginAdmin();
    adminCookie = res.cookie;
    adminUser = res.user;
  });

  beforeEach(() => {
    return UserModel.update({
      data: {
        isProfileCompleted: true,
      },
      where: {
        id: adminUser.id,
      },
    });
  });

  it("returns 403, when isProfileCompleted is false", async () => {
    await UserModel.update({
      data: {
        isProfileCompleted: false,
      },
      where: {
        id: adminUser.id,
      },
    });

    const response = await request(app).get("/api/users").set("Cookie", adminCookie).send();

    expect(response.status).toEqual(403);
  });

  it("returns a list of users", async () => {
    const response = await request(app).get("/api/users").set("Cookie", adminCookie).send();

    expect(response.status).toEqual(200);
    expect(response.body.users).toHaveLength(NUM_USERS + 1);
  });

  it("does not return 'password' field", async () => {
    const response = await request(app).get("/api/users").set("Cookie", adminCookie).send();

    expect(response.status).toEqual(200);
    expect(response.body.users[0]).not.toHaveProperty("password");
  });
});
