import request from "supertest";
import { app } from "@/app";
import { loginAdmin, loginRegular } from "@/tests/helpers/user";
import { UserSeeder } from "@/tests/seed/UserSeeder";
import { UserModel } from "@/models/user";

let userId: string;

beforeAll(async () => {
  const user = await UserSeeder.seedOne();
  userId = user.id;
});

describe("Unauthorized", () => {
  it("returns 401, when no user is authenticated", async () => {
    const response = await request(app).put(`/api/users/ban/${userId}`).send();

    expect(response.status).toEqual(401);
  });

  it("returns 403, when logged user is not ADMIN", async () => {
    const { cookie } = await loginRegular();

    const response = await request(app)
      .put(`/api/users/ban/${userId}`)
      .set("Cookie", cookie)
      .send();

    expect(response.status).toEqual(403);
  });
});

describe("Admin Logged User", () => {
  let adminCookie: string;
  let adminUserId: string;

  beforeAll(async () => {
    const res = await loginAdmin();
    adminCookie = res.cookie;
    adminUserId = res.user.id;
  });

  it("returns 404, when user id does not exist", async () => {
    const response = await request(app)
      .put("/api/users/ban/doesnotexist")
      .set("Cookie", adminCookie)
      .send();

    expect(response.status).toEqual(404);
  });

  it("returns 403, when user tries to ban itself", async () => {
    const response = await request(app)
      .put(`/api/users/ban/${adminUserId}`)
      .set("Cookie", adminCookie)
      .send();

    expect(response.status).toEqual(403);
  });

  it("Bans user", async () => {
    const response = await request(app)
      .put(`/api/users/ban/${userId}`)
      .set("Cookie", adminCookie)
      .send();

    expect(response.body.user.isBanned).toBe(true);

    const user = await UserModel.findUnique({
      where: {
        id: userId,
      },
    });

    expect(user?.isBanned).toBe(true);
  });
});

it.todo("Check if banned user was inserted");
