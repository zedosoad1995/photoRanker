import request from "supertest";
import { app } from "@/app";
import { Seeder } from "@/tests/seed/Seeder";
import { loginAdmin, loginRegular } from "@/tests/helpers/user";
import { UserSeeder } from "@/tests/seed/UserSeeder";

const NUM_USERS = 10;

let adminCookie: string;

describe("Unauthorized", () => {
  it("returns 401, when no user is authenticated", async () => {
    const response = await request(app).get("/api/users").send();

    expect(response.status).toEqual(401);
  });

  it("returns 403, when logged user is not ADMIN", async () => {
    const { cookie } = await loginRegular();

    const response = await request(app)
      .get("/api/users")
      .set("Cookie", cookie)
      .send();

    expect(response.status).toEqual(403);
  });
});

describe("Admin Logged User", () => {
  beforeAll(async () => {
    await (Seeder("User") as UserSeeder).seed({ numRepeat: NUM_USERS });
    const res = await loginAdmin();
    adminCookie = res.cookie;
  });

  it("returns a list of users", async () => {
    const response = await request(app)
      .get("/api/users")
      .set("Cookie", adminCookie)
      .send();

    expect(response.status).toEqual(200);
    expect(response.body.users).toHaveLength(NUM_USERS + 1);
  });

  it("does not return 'password' field", async () => {
    const response = await request(app)
      .get("/api/users")
      .set("Cookie", adminCookie)
      .send();

    expect(response.status).toEqual(200);
    expect(response.body.users[0]).not.toHaveProperty("password");
  });
});
