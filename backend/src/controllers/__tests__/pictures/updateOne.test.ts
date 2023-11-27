import request from "supertest";
import { app } from "@/app";
import { loginAdmin, loginRegular } from "@/tests/helpers/user";
import { PictureSeeder } from "@/tests/seed/PictureSeeder";
import { PictureModel } from "@/models/picture";

describe("Unauthorized", () => {
  it("returns 401, when no user is authenticated", async () => {
    const response = await request(app).patch("/api/pictures/picId").send();

    expect(response.status).toEqual(401);
  });
});

let adminCookie: string;
let adminUserId: string;
let regularCookie: string;
let regularUserId: string;

beforeAll(async () => {
  let res = await loginAdmin();
  adminCookie = res.cookie;
  adminUserId = res.user.id;

  res = await loginRegular();
  regularCookie = res.cookie;
  regularUserId = res.user.id;
});

describe("Regular Logged User", () => {
  it("Updates inactive picture to active", async () => {
    const inactivePicture = await PictureSeeder.seedOne({
      userId: regularUserId,
      isActive: false,
    });

    const response = await request(app)
      .patch(`/api/pictures/${inactivePicture.id}`)
      .set("Cookie", regularCookie)
      .send({
        isActive: true,
      });

    expect(response.status).toEqual(204);

    await PictureModel.findUnique({ where: { id: inactivePicture.id } }).then((pic) =>
      expect(pic?.isActive).toEqual(true)
    );
  });

  it("Updates active picture to inactive", async () => {
    const activePicture = await PictureSeeder.seedOne({
      userId: regularUserId,
      isActive: true,
    });

    const response = await request(app)
      .patch(`/api/pictures/${activePicture.id}`)
      .set("Cookie", regularCookie)
      .send({
        isActive: false,
      });

    expect(response.status).toEqual(204);

    await PictureModel.findUnique({ where: { id: activePicture.id } }).then((pic) =>
      expect(pic?.isActive).toEqual(false)
    );
  });

  it("returns 404, when trying to update pictureId that does not exist", async () => {
    const response = await request(app)
      .patch(`/api/pictures/doesNotExist`)
      .set("Cookie", regularCookie)
      .send({
        isActive: false,
      });

    expect(response.status).toEqual(404);
  });

  it("returns 404, when trying to update picture that belongs to another user", async () => {
    const picture = await PictureSeeder.seedOne({
      userId: adminUserId,
    });

    const response = await request(app)
      .patch(`/api/pictures/${picture.id}`)
      .set("Cookie", regularCookie)
      .send({
        isActive: false,
      });

    expect(response.status).toEqual(404);
  });
});

describe("Admin Logged User", () => {
  it("Updates picture belonging to another user", async () => {
    const picture = await PictureSeeder.seedOne({
      userId: regularUserId,
      isActive: true,
    });

    const response = await request(app)
      .patch(`/api/pictures/${picture.id}`)
      .set("Cookie", adminCookie)
      .send({
        isActive: false,
      });

    expect(response.status).toEqual(204);

    await PictureModel.findUnique({ where: { id: picture.id } }).then((pic) =>
      expect(pic?.isActive).toEqual(false)
    );
  });

  it("returns 404, when trying to update pictureId that does not exist", async () => {
    const response = await request(app)
      .patch(`/api/pictures/doesNotExist`)
      .set("Cookie", regularCookie)
      .send({
        isActive: false,
      });

    expect(response.status).toEqual(404);
  });
});
