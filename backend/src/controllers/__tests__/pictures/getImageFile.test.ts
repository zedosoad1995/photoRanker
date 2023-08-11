import request from "supertest";
import { app } from "@/app";
import { loginAdmin, loginRegular } from "@/tests/helpers/user";
import { UserSeeder } from "@/tests/seed/UserSeeder";
import { PictureSeeder } from "@/tests/seed/PictureSeeder";
import { rimrafSync } from "rimraf";
import { TEST_IMAGES_FOLDER_PATH } from "@/constants/picture";
import { UserModel } from "@/models/user";
import { MatchSeeder } from "@/tests/seed/MatchSeeder";

beforeEach(() => {
  rimrafSync(TEST_IMAGES_FOLDER_PATH + "/*", { glob: true });
});

afterAll(() => {
  rimrafSync(TEST_IMAGES_FOLDER_PATH + "/*", { glob: true });
});

describe("Unauthorized", () => {
  it("returns 401, when no user is authenticated", async () => {
    const response = await request(app).get("/api/pictures/image/imagePath").send();

    expect(response.status).toEqual(401);
  });
});

describe("Regular Logged User", () => {
  let regularCookie: string;
  let regularUserId: string;

  beforeEach(async () => {
    const res = await loginRegular();
    regularCookie = res.cookie;
    regularUserId = res.user.id;

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
      .get("/api/pictures/image/something")
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
      .get("/api/pictures/image/something")
      .set("Cookie", regularCookie)
      .send();

    expect(response.status).toEqual(403);
  });

  it("returns 404, when picture does not exist", async () => {
    const response = await request(app)
      .get("/api/pictures/image/doesnotexist")
      .set("Cookie", regularCookie)
      .send();

    expect(response.status).toEqual(404);
  });

  it("returns 403, when user tries to access other's picture which is not in an active match", async () => {
    const user = await UserSeeder.createOne();
    const picture = await PictureSeeder.seedOne({ userId: user.id });

    const response = await request(app)
      .get(`/api/pictures/image/${picture.filepath}`)
      .set("Cookie", regularCookie)
      .send();

    expect(response.status).toEqual(403);
  });

  it("returns 200, when user tries its own picture", async () => {
    const picture = await PictureSeeder.seedOne({ userId: regularUserId });

    const response = await request(app)
      .get(`/api/pictures/image/${picture.filepath}`)
      .set("Cookie", regularCookie)
      .send();

    expect(response.status).toEqual(200);
  });

  it("returns 200, when user tries other's picture, given that it is in an active match", async () => {
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
      data: { activeMatch: { connect: { id: match.id } } },
      where: {
        id: regularUserId,
      },
    });

    const response = await request(app)
      .get(`/api/pictures/image/${picture.filepath}`)
      .set("Cookie", regularCookie)
      .send();

    expect(response.status).toEqual(200);
  });
});

describe("Admin Logged User", () => {
  let adminCookie: string;
  let adminUserId: string;

  beforeEach(async () => {
    const res = await loginAdmin();
    adminCookie = res.cookie;
    adminUserId = res.user.id;
  });

  it("returns 200, when user tries to its own picture", async () => {
    const picture = await PictureSeeder.seedOne({ userId: adminUserId });

    const response = await request(app)
      .get(`/api/pictures/image/${picture.filepath}`)
      .set("Cookie", adminCookie)
      .send();

    expect(response.status).toEqual(200);
  });

  it("returns 200, when user tries other's picture, not in an active match", async () => {
    const user = await UserSeeder.createOne();
    const picture = await PictureSeeder.seedOne({ userId: user.id });

    const response = await request(app)
      .get(`/api/pictures/image/${picture.filepath}`)
      .set("Cookie", adminCookie)
      .send();

    expect(response.status).toEqual(200);
  });
});
