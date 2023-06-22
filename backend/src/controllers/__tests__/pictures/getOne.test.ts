import request from "supertest";
import { app } from "@/app";
import { Seeder } from "@/tests/seed/Seeder";
import { loginAdmin, loginRegular } from "@/tests/helpers/user";
import { UserSeeder } from "@/tests/seed/UserSeeder";
import { PictureSeeder } from "@/tests/seed/PictureSeeder";

let pictureId: string;

beforeAll(async () => {
  const users = await (Seeder("User") as UserSeeder).seed({ numRepeat: 1 });
  const user = users[0];

  const pictures = await (Seeder("Picture") as PictureSeeder).seed({
    data: { userId: user.id },
    numRepeat: 1,
  });
  pictureId = pictures[0].id;
});

describe("Unauthorized", () => {
  it("returns 401, when no user is authenticated", async () => {
    const response = await request(app)
      .get(`/api/pictures/${pictureId}`)
      .send();

    expect(response.status).toEqual(401);
  });
});

describe("Regular Logged User", () => {
  let regularCookie: string;
  let regularUserPictureId: string;

  beforeAll(async () => {
    const res = await loginRegular();
    regularCookie = res.cookie;

    const pictures = await (Seeder("Picture") as PictureSeeder).createMany({
      data: { userId: res.user.id },
      numRepeat: 1,
    });
    regularUserPictureId = pictures[0].id;
  });

  it("returns 403, when passed id does not correspond to picture of logged user", async () => {
    const response = await request(app)
      .get(`/api/pictures/${pictureId}`)
      .set("Cookie", regularCookie)
      .send();

    expect(response.status).toEqual(403);
  });

  it("returns picture, when passed id corresponds to picture of logged user", async () => {
    const response = await request(app)
      .get(`/api/pictures/${regularUserPictureId}`)
      .set("Cookie", regularCookie)
      .send();

    expect(response.status).toEqual(200);
    expect(response.body.picture.id).toEqual(regularUserPictureId);
  });
});

describe("Admin Logged User", () => {
  let adminCookie: string;

  beforeAll(async () => {
    const res = await loginAdmin();
    adminCookie = res.cookie;
  });

  it("returns 404, when picture id does not exist", async () => {
    const response = await request(app)
      .get("/api/pictures/doesnotexist")
      .set("Cookie", adminCookie)
      .send();

    expect(response.status).toEqual(404);
  });

  it("returns picture", async () => {
    const response = await request(app)
      .get(`/api/pictures/${pictureId}`)
      .set("Cookie", adminCookie)
      .send();

    expect(response.status).toEqual(200);
    expect(response.body.picture.id).toEqual(pictureId);
  });
});
