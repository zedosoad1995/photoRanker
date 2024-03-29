import request from "supertest";
import { app } from "@/app";
import { rimrafSync } from "rimraf";
import { IMAGES_FOLDER_PATH, TEST_IMAGES_FOLDER_PATH } from "@/constants/picture";
import { PICTURE } from "@/constants/messages";
import { loginAdmin, loginRegular } from "@/tests/helpers/user";
import { User } from "@prisma/client";
import { PictureModel } from "@/models/picture";
import { PictureSeeder } from "@/tests/seed/PictureSeeder";
import { UserModel } from "@/models/user";
import { mainStorageInteractor } from "@/container";

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
      .field("info", JSON.stringify({ isGlobal: true }))
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
      .field("info", JSON.stringify({ isGlobal: true }))
      .attach("image", "src/tests/fixtures/files/noExtension");

    expect(response.status).toEqual(403);
  });

  it("throws an error, when file has no extension", async () => {
    const response = await request(app)
      .post("/api/pictures")
      .set("Cookie", regularCookie)
      .field("info", JSON.stringify({ isGlobal: true }))
      .attach("image", "src/tests/fixtures/files/noExtension");

    expect(response.status).toEqual(400);
    expect(response.body.message).toEqual(PICTURE.INVALID_EXTENSION);
  });

  it("throws an error, when file does not have a valid image extension", async () => {
    const response = await request(app)
      .post("/api/pictures")
      .set("Cookie", regularCookie)
      .field("info", JSON.stringify({ isGlobal: true }))
      .attach("image", "src/tests/fixtures/files/text.txt");

    expect(response.status).toEqual(400);
    expect(response.body.message).toEqual(PICTURE.INVALID_EXTENSION);
  });

  it("throws an error, when file is too big", async () => {
    const response = await request(app)
      .post("/api/pictures")
      .set("Cookie", regularCookie)
      .field("info", JSON.stringify({ isGlobal: true }))
      .attach("image", "src/tests/fixtures/files/image-too-big.jpg");

    expect(response.status).toEqual(400);
    expect(response.body.message).toEqual(PICTURE.FILE_TOO_LARGE);
  });

  it("throws an error, when no file is uploaded", async () => {
    const response = await request(app)
      .post("/api/pictures")
      .set("Cookie", regularCookie)
      .field("info", JSON.stringify({ isGlobal: true }));

    expect(response.status).toEqual(400);
    expect(response.body.message).toEqual(PICTURE.NO_FILE);
  });

  it("throws an error, when image dimensions are too small", async () => {
    const response = await request(app)
      .post("/api/pictures")
      .set("Cookie", regularCookie)
      .field("info", JSON.stringify({ isGlobal: true }))
      .attach("image", "src/tests/fixtures/files/small-image-dim.jpg");

    expect(response.status).toEqual(400);
    expect(response.body.message).toEqual(PICTURE.IMAGE_DIM_TOO_SMALL);
  });

  it("throws an error, when jpg image is corrupt", async () => {
    const response = await request(app)
      .post("/api/pictures")
      .set("Cookie", regularCookie)
      .field("info", JSON.stringify({ isGlobal: true }))
      .attach("image", "src/tests/fixtures/files/corrupt-image.jpg");

    expect(response.status).toEqual(400);
  });

  it("throws an error, when number of pictures passes the limit", async () => {
    await PictureSeeder.seedMany({
      data: { userId: regularUser.id },
      numRepeat: regularUser.numLimitPhotos,
    });

    const response = await request(app)
      .post("/api/pictures")
      .set("Cookie", regularCookie)
      .field("info", JSON.stringify({ isGlobal: true }))
      .attach("image", "src/tests/fixtures/files/image.jpg");

    expect(response.status).toEqual(400);
  });

  it("Creates Picture assigned to logged user", async () => {
    await PictureSeeder.deleteAll();
    const saveNewImageMock = jest
      .spyOn(mainStorageInteractor, "saveNewImage")
      .mockResolvedValue(`${IMAGES_FOLDER_PATH}/123456789.jpg`);

    const response = await request(app)
      .post("/api/pictures")
      .set("Cookie", regularCookie)
      .field("info", JSON.stringify({ isGlobal: true }))
      .attach("image", "src/tests/fixtures/files/image.jpg");

    expect(response.status).toEqual(201);
    expect(response.body.picture.userId).toEqual(regularUser.id);

    const picture = await PictureModel.findFirst();
    expect(picture?.userId).toEqual(regularUser.id);

    expect(saveNewImageMock).toBeCalledTimes(1);

    saveNewImageMock.mockRestore();
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

  it("Creates Picture assigned to logged user", async () => {
    await PictureSeeder.deleteAll();
    const saveNewImageMock = jest
      .spyOn(mainStorageInteractor, "saveNewImage")
      .mockResolvedValue(`${IMAGES_FOLDER_PATH}/123456789.jpg`);

    const response = await request(app)
      .post("/api/pictures")
      .set("Cookie", adminCookie)
      .field("info", JSON.stringify({ isGlobal: true }))
      .attach("image", "src/tests/fixtures/files/image.jpg");

    expect(response.status).toEqual(201);
    expect(response.body.picture.userId).toEqual(adminUser.id);

    const picture = await PictureModel.findFirst();
    expect(picture?.userId).toEqual(adminUser.id);

    expect(saveNewImageMock).toBeCalledTimes(1);

    saveNewImageMock.mockRestore();
  });

  it("Creates Picture, even when regular user picture limit is passed", async () => {
    const saveNewImageMock = jest
      .spyOn(mainStorageInteractor, "saveNewImage")
      .mockResolvedValue(`${IMAGES_FOLDER_PATH}/123456789.jpg`);

    await PictureSeeder.seedMany({
      data: { userId: adminUser.id },
      numRepeat: adminUser.numLimitPhotos,
    });

    const response = await request(app)
      .post("/api/pictures")
      .set("Cookie", adminCookie)
      .field("info", JSON.stringify({ isGlobal: true }))
      .attach("image", "src/tests/fixtures/files/image.jpg");

    expect(response.status).toEqual(201);

    const numPictures = await PictureModel.count({
      where: {
        userId: adminUser.id,
      },
    });
    expect(numPictures).toBe(adminUser.numLimitPhotos + 1);

    saveNewImageMock.mockRestore();
  });
});
