import request from "supertest";
import { app } from "@/app";
import { Seeder } from "@/tests/seed/Seeder";
import { loginAdmin, loginRegular } from "@/tests/helpers/user";

let userId: string;

beforeAll(async () => {
  const user = await Seeder("User")?.seed();

  if (user) {
    userId = user[0].id;
  }
});

describe("Unauthorized", () => {
  it("returns 401, when no user is authenticated", async () => {
    const response = await request(app).get(`/api/users/${userId}`).send();

    expect(response.status).toEqual(401);
  });
});

describe("Regular Logged User", () => {
  let regularCookie: string;
  let regularUser;

  beforeAll(async () => {
    const res = await loginRegular();
    regularCookie = res.cookie;
    regularUser = res.user;
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
