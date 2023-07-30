import request from "supertest";
import { app } from "@/app";
import { loginAdmin, loginRegular } from "@/tests/helpers/user";
import { UserSeeder } from "@/tests/seed/UserSeeder";
import { PictureSeeder } from "@/tests/seed/PictureSeeder";
import { PictureModel } from "@/models/picture";
import { rimrafSync } from "rimraf";
import { TEST_IMAGES_FOLDER_PATH } from "@/constants/picture";
import { UserModel } from "@/models/user";
import { User } from "@prisma/client";

let pictureId: string;

beforeAll(async () => {
  const user = await UserSeeder.seedOne();

  const picture = await PictureSeeder.seedOne({ userId: user.id });
  pictureId = picture.id;
});

beforeEach(() => {
  rimrafSync(TEST_IMAGES_FOLDER_PATH + "/*", { glob: true });
});

afterAll(() => {
  rimrafSync(TEST_IMAGES_FOLDER_PATH + "/*", { glob: true });
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
  let regularUser: User;

  beforeAll(async () => {
    const res = await loginRegular();
    regularCookie = res.cookie;
    regularUser = res.user;

    const picture = await PictureSeeder.createOne({ userId: res.user.id });
    regularUserPictureId = picture.id;
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
      .delete(`/api/pictures/${pictureId}`)
      .set("Cookie", regularCookie)
      .send();

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
      .delete(`/api/pictures/${pictureId}`)
      .set("Cookie", regularCookie)
      .send();

    expect(response.status).toEqual(403);
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
