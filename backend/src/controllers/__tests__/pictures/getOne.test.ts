import request from "supertest";
import { app } from "@/app";
import { loginAdmin, loginRegular } from "@/tests/helpers/user";
import { UserSeeder } from "@/tests/seed/UserSeeder";
import { PictureSeeder } from "@/tests/seed/PictureSeeder";
import { rimrafSync } from "rimraf";
import { TEST_IMAGES_FOLDER_PATH } from "@/constants/picture";
import { MatchSeeder } from "@/tests/seed/MatchSeeder";
import { UserModel } from "@/models/user";

beforeEach(() => {
  rimrafSync(TEST_IMAGES_FOLDER_PATH + "/*", { glob: true });
});

afterAll(() => {
  rimrafSync(TEST_IMAGES_FOLDER_PATH + "/*", { glob: true });
});

describe("Unauthorized", () => {
  it("returns 401, when no user is authenticated", async () => {
    const response = await request(app).get("/api/pictures/picId").send();

    expect(response.status).toEqual(401);
  });
});

describe("Regular Logged User", () => {
  let regularCookie: string;
  let regularUserId: string;
  let regularUserPictureId: string;

  beforeEach(async () => {
    const res = await loginRegular();
    regularCookie = res.cookie;
    regularUserId = res.user.id;

    const picture = await PictureSeeder.seedOne({
      userId: res.user.id,
    });
    regularUserPictureId = picture.id;
  });

  beforeEach(() => {
    return UserModel.update({
      data: {
        isProfileCompleted: true,
        isEmailVerified: true,
      },
      where: {
        id: regularUserId,
      },
    });
  });

  it("returns 403, when isProfileCompleted is false", async () => {
    await UserModel.update({
      data: {
        isProfileCompleted: false,
      },
      where: {
        id: regularUserId,
      },
    });

    const response = await request(app)
      .get("/api/pictures/something")
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
        id: regularUserId,
      },
    });

    const response = await request(app)
      .get("/api/pictures/something")
      .set("Cookie", regularCookie)
      .send();

    expect(response.status).toEqual(403);
  });

  it("returns 403, when passed id does not correspond to picture of logged user", async () => {
    const user = await UserSeeder.createOne();
    const picture = await PictureSeeder.seedOne({
      userId: user.id,
    });

    const response = await request(app)
      .get(`/api/pictures/${picture.id}`)
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

  it("returns picture, when passed id corresponds to other's picture, but it belongs to the active match", async () => {
    const user = await UserSeeder.createOne();
    const picture = await PictureSeeder.seedOne({ userId: user.id });
    const match = await MatchSeeder.seedOne({
      pictures: {
        connect: {
          id: picture.id,
        },
      },
    });
    await UserModel.update({
      data: { activeMatchId: match.id },
      where: {
        id: regularUserId,
      },
    });

    const response = await request(app)
      .get(`/api/pictures/${picture.id}`)
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

  it("returns 404, when picture id does not exist", async () => {
    const response = await request(app)
      .get("/api/pictures/doesnotexist")
      .set("Cookie", adminCookie)
      .send();

    expect(response.status).toEqual(404);
  });

  it("returns picture", async () => {
    const user = await UserSeeder.createOne();
    const picture = await PictureSeeder.seedOne({
      userId: user.id,
    });

    const response = await request(app)
      .get(`/api/pictures/${picture.id}`)
      .set("Cookie", adminCookie)
      .send();

    expect(response.status).toEqual(200);
    expect(response.body.picture.id).toEqual(picture.id);
  });
});
