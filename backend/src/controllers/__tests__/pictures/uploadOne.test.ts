import request from "supertest";
import { app } from "@/app";
import { rimrafSync } from "rimraf";
import { LIMIT_PICTURES, TEST_IMAGES_FOLDER_PATH } from "@/constants/picture";
import { PICTURE } from "@/constants/messages";
import { loginAdmin, loginRegular } from "@/tests/helpers/user";
import { User } from "@prisma/client";
import { PictureModel } from "@/models/picture";
import fs from "fs";
import { PictureSeeder } from "@/tests/seed/PictureSeeder";
import { normalizedJoin } from "@/helpers/file";
import { UserModel } from "@/models/user";

beforeEach(() => {
  rimrafSync(TEST_IMAGES_FOLDER_PATH + "/*", { glob: true });
});

afterAll(() => {
  rimrafSync(TEST_IMAGES_FOLDER_PATH + "/*", { glob: true });
});

describe("Unauthorized", () => {
  it("returns 401, when no user is authenticated", async () => {
    const response = await request(app).post("/api/pictures").send();

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
      .post("/api/pictures")
      .set("Cookie", regularCookie)
      .attach("image", "src/tests/fixtures/files/noExtension");

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
      .post("/api/pictures")
      .set("Cookie", regularCookie)
      .attach("image", "src/tests/fixtures/files/noExtension");

    expect(response.status).toEqual(403);
  });

  it("throws an error, when file has no extension", async () => {
    const response = await request(app)
      .post("/api/pictures")
      .set("Cookie", regularCookie)
      .attach("image", "src/tests/fixtures/files/noExtension");

    expect(response.status).toEqual(400);
    expect(response.body.message).toEqual(PICTURE.INVALID_EXTENSION);
  });

  it("throws an error, when file does not have a valid image extension", async () => {
    const response = await request(app)
      .post("/api/pictures")
      .set("Cookie", regularCookie)
      .attach("image", "src/tests/fixtures/files/text.txt");

    expect(response.status).toEqual(400);
    expect(response.body.message).toEqual(PICTURE.INVALID_EXTENSION);
  });

  it("throws an error, when file is too big", async () => {
    const response = await request(app)
      .post("/api/pictures")
      .set("Cookie", regularCookie)
      .attach("image", "src/tests/fixtures/files/image-too-big.jpg");

    expect(response.status).toEqual(400);
    expect(response.body.message).toEqual(PICTURE.FILE_TOO_LARGE);
  });

  it("throws an error, when no file is uploaded", async () => {
    const response = await request(app)
      .post("/api/pictures")
      .set("Cookie", regularCookie)
      .send();

    expect(response.status).toEqual(400);
    expect(response.body.message).toEqual(PICTURE.NO_FILE);
  });

  it("throws an error, when image dimensions are too small", async () => {
    const response = await request(app)
      .post("/api/pictures")
      .set("Cookie", regularCookie)
      .attach("image", "src/tests/fixtures/files/small-image-dim.jpg");

    expect(response.status).toEqual(400);
    expect(response.body.message).toEqual(PICTURE.IMAGE_DIM_TOO_SMALL);
  });

  it("throws an error, when jpg image is corrupt", async () => {
    const response = await request(app)
      .post("/api/pictures")
      .set("Cookie", regularCookie)
      .attach("image", "src/tests/fixtures/files/corrupt-image.jpg");

    expect(response.status).toEqual(400);
  });

  it("throws an error, when number of pictures passes the limit", async () => {
    await PictureSeeder.seedMany({
      data: { userId: regularUser.id },
      numRepeat: LIMIT_PICTURES,
    });

    const response = await request(app)
      .post("/api/pictures")
      .set("Cookie", regularCookie)
      .attach("image", "src/tests/fixtures/files/image.jpg");

    expect(response.status).toEqual(400);
  });

  it("Creates Picture assigned to logged user, adds image file to folder", async () => {
    await PictureSeeder.deleteAll();

    const response = await request(app)
      .post("/api/pictures")
      .set("Cookie", regularCookie)
      .attach("image", "src/tests/fixtures/files/image.jpg");

    expect(response.status).toEqual(201);
    expect(response.body.picture.userId).toEqual(regularUser.id);

    const picture = await PictureModel.findFirst();
    expect(picture?.userId).toEqual(regularUser.id);

    expect(
      fs.existsSync(
        normalizedJoin(TEST_IMAGES_FOLDER_PATH, decodeURI(picture?.filepath!))
      )
    ).toBeTruthy();
  });
});

describe("Admin Logged User", () => {
  let adminCookie: string;
  let adminUser: User;

  beforeAll(async () => {
    const res = await loginAdmin();
    adminCookie = res.cookie;
    adminUser = res.user;
  });

  it("Creates Picture assigned to logged user, adds image file to folder", async () => {
    await PictureSeeder.deleteAll();

    const response = await request(app)
      .post("/api/pictures")
      .set("Cookie", adminCookie)
      .attach("image", "src/tests/fixtures/files/image.jpg");

    expect(response.status).toEqual(201);
    expect(response.body.picture.userId).toEqual(adminUser.id);

    const picture = await PictureModel.findFirst();
    expect(picture?.userId).toEqual(adminUser.id);

    expect(
      fs.existsSync(
        normalizedJoin(TEST_IMAGES_FOLDER_PATH, decodeURI(picture?.filepath!))
      )
    ).toBeTruthy();
  });

  it("Creates Picture, even when regular user picture limit is passed", async () => {
    await PictureSeeder.seedMany({
      data: { userId: adminUser.id },
      numRepeat: LIMIT_PICTURES,
    });

    const response = await request(app)
      .post("/api/pictures")
      .set("Cookie", adminCookie)
      .attach("image", "src/tests/fixtures/files/image.jpg");

    expect(response.status).toEqual(201);

    const numPictures = await PictureModel.count({
      where: {
        userId: adminUser.id,
      },
    });
    expect(numPictures).toBe(LIMIT_PICTURES + 1);
  });
});
