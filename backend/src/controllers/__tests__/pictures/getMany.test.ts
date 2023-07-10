import request from "supertest";
import { app } from "@/app";
import { loginAdmin, loginRegular } from "@/tests/helpers/user";
import { PictureSeeder } from "@/tests/seed/PictureSeeder";
import { UserSeeder } from "@/tests/seed/UserSeeder";
import { User } from "@prisma/client";

const NUM_PICTURES = 10;

describe("Unauthorized", () => {
  it("returns 401, when no user is authenticated", async () => {
    const response = await request(app).get("/api/pictures").send();

    expect(response.status).toEqual(401);
  });
});

describe("Regular Logged User", () => {
  let regularCookie: string;
  let loggedUser: User;

  beforeAll(async () => {
    const randomUser = await UserSeeder.createOne();

    const res = await loginRegular();
    regularCookie = res.cookie;
    loggedUser = res.user;

    await PictureSeeder.seedMany({
      data: [{ userId: loggedUser.id }, { userId: randomUser.id }],
    });
  });

  it("returns a list of pictures belonging to logged user", async () => {
    const response = await request(app)
      .get("/api/pictures")
      .set("Cookie", regularCookie)
      .send();

    expect(response.status).toEqual(200);
    expect(response.body.pictures).toHaveLength(1);
    expect(response.body.pictures[0].userId).toEqual(loggedUser.id);
  });
});

describe("Admin Logged User", () => {
  let adminCookie: string;

  beforeAll(async () => {
    const res = await loginAdmin();
    adminCookie = res.cookie;

    await PictureSeeder.seedMany({
      data: { userId: res.user.id },
      numRepeat: NUM_PICTURES,
    });
  });

  it("returns a list of pictures", async () => {
    const response = await request(app)
      .get("/api/pictures")
      .set("Cookie", adminCookie)
      .send();

    expect(response.status).toEqual(200);
    expect(response.body.pictures).toHaveLength(NUM_PICTURES);
  });
});
