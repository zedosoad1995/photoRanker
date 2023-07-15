import request from "supertest";
import { app } from "@/app";
import { rimrafSync } from "rimraf";
import { TEST_IMAGES_FOLDER_PATH } from "@/constants/picture";
import { PICTURE } from "@/constants/messages";
import { loginRegular } from "@/tests/helpers/user";
import { User } from "@prisma/client";
import { PictureModel } from "@/models/picture";
import fs from "fs";
import path from "path";
import { PictureSeeder } from "@/tests/seed/PictureSeeder";

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
    const response = await request(app).post("/api/pictures").set("Cookie", regularCookie).send();

    expect(response.status).toEqual(400);
    expect(response.body.message).toEqual(PICTURE.NO_FILE);
  });

  it("Created Picture assigned to logged user, adds image file to folder", async () => {
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
      fs.existsSync(path.resolve(TEST_IMAGES_FOLDER_PATH, decodeURI(picture?.filepath!)))
    ).toBeTruthy();
  });
});

describe("Admin Logged User", () => {
  let adminCookie: string;
  let adminUser: User;

  beforeAll(async () => {
    const res = await loginRegular();
    adminCookie = res.cookie;
    adminUser = res.user;
  });

  it("Created Picture assigned to logged user, adds image file to folder", async () => {
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
      fs.existsSync(path.resolve(TEST_IMAGES_FOLDER_PATH, decodeURI(picture?.filepath!)))
    ).toBeTruthy();
  });
});
