import request from "supertest";
import { app } from "@/app";
import { loginAdmin, loginRegular } from "@/tests/helpers/user";
import { UserSeeder } from "@/tests/seed/UserSeeder";
import { PictureSeeder } from "@/tests/seed/PictureSeeder";
import { PictureModel } from "@/models/picture";

let pictureId: string;

beforeAll(async () => {
  const users = await UserSeeder.seed();
  const user = users[0];

  const pictures = await PictureSeeder.seed({
    data: { userId: user.id },
  });
  pictureId = pictures[0].id;
});

describe("Unauthorized", () => {
  it("returns 401, when no user is authenticated", async () => {
    const response = await request(app)
      .delete(`/api/pictures/${pictureId}`)
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

    const pictures = await PictureSeeder.createMany({
      data: { userId: res.user.id },
    });
    regularUserPictureId = pictures[0].id;
  });

  it("returns 403, when passed id does not correspond to picture of logged user", async () => {
    const response = await request(app)
      .delete(`/api/pictures/${pictureId}`)
      .set("Cookie", regularCookie)
      .send();

    expect(response.status).toEqual(403);
  });

  it("deletes picture, when passed id corresponds to picture of logged user", async () => {
    const response = await request(app)
      .delete(`/api/pictures/${regularUserPictureId}`)
      .set("Cookie", regularCookie)
      .send();

    expect(response.status).toEqual(204);

    const existingPicture = await PictureModel.findUnique({
      where: {
        id: regularUserPictureId,
      },
    });

    expect(existingPicture).toBeFalsy();
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
      .delete("/api/pictures/doesnotexist")
      .set("Cookie", adminCookie)
      .send();

    expect(response.status).toEqual(404);
  });

  it("deletes picture", async () => {
    const response = await request(app)
      .delete(`/api/pictures/${pictureId}`)
      .set("Cookie", adminCookie)
      .send();

    expect(response.status).toEqual(204);

    const existingPicture = await PictureModel.findUnique({
      where: {
        id: pictureId,
      },
    });

    expect(existingPicture).toBeFalsy();
  });
});
