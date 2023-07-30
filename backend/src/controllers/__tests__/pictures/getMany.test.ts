import request from "supertest";
import { app } from "@/app";
import { loginAdmin, loginRegular } from "@/tests/helpers/user";
import { PictureSeeder } from "@/tests/seed/PictureSeeder";
import { UserSeeder } from "@/tests/seed/UserSeeder";
import { User } from "@prisma/client";
import { rimrafSync } from "rimraf";
import { TEST_IMAGES_FOLDER_PATH } from "@/constants/picture";
import { UserModel } from "@/models/user";

const NUM_PICTURES = 10;

beforeEach(() => {
  rimrafSync(TEST_IMAGES_FOLDER_PATH + "/*", { glob: true });
});

afterAll(() => {
  rimrafSync(TEST_IMAGES_FOLDER_PATH + "/*", { glob: true });
});

describe("Unauthorized", () => {
  it("returns 401, when no user is authenticated", async () => {
    const response = await request(app).get("/api/pictures").send();

    expect(response.status).toEqual(401);
  });
});

describe("Regular Logged User", () => {
  let regularCookie: string;
  let loggedUser: User;
  let randomUser: User;

  beforeAll(async () => {
    randomUser = await UserSeeder.createOne();

    const res = await loginRegular();
    regularCookie = res.cookie;
    loggedUser = res.user;

    await PictureSeeder.seedMany({
      data: [{ userId: loggedUser.id }, { userId: randomUser.id }],
    });
  });

  beforeEach(() => {
    return UserModel.update({
      data: {
        isProfileCompleted: true,
        isEmailVerified: true,
      },
      where: {
        id: loggedUser.id,
      },
    });
  });

  it("returns 403, when isProfileCompleted is false", async () => {
    await UserModel.update({
      data: {
        isProfileCompleted: false,
      },
      where: {
        id: loggedUser.id,
      },
    });

    const response = await request(app)
      .get("/api/pictures")
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
        id: loggedUser.id,
      },
    });

    const response = await request(app)
      .get("/api/pictures")
      .set("Cookie", regularCookie)
      .send();

    expect(response.status).toEqual(403);
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

  describe("Query", () => {
    describe("userId", () => {
      it("throws error, when 'userId' is an array of strings", async () => {
        const response = await request(app)
          .get(`/api/pictures?userId=a&userId=b`)
          .set("Cookie", regularCookie)
          .send();

        expect(response.status).toEqual(422);
      });

      it("throws error, when 'userId' does not correspond to logged user", async () => {
        const response = await request(app)
          .get(`/api/pictures?userId=${randomUser.id}`)
          .set("Cookie", regularCookie)
          .send();

        expect(response.status).toEqual(403);
      });

      it("returns pictures from logged user, 'userId' corresponds to logged user", async () => {
        const response = await request(app)
          .get(`/api/pictures?userId=${loggedUser.id}`)
          .set("Cookie", regularCookie)
          .send();

        expect(response.status).toEqual(200);
        expect(response.body.pictures).toHaveLength(1);
        expect(response.body.pictures[0].userId).toEqual(loggedUser.id);
      });

      it("returns pictures from logged user, when 'userId' is undefined", async () => {
        const response = await request(app)
          .get("/api/pictures?userId=")
          .set("Cookie", regularCookie)
          .send();

        expect(response.status).toEqual(200);
        expect(response.body.pictures).toHaveLength(1);
        expect(response.body.pictures[0].userId).toEqual(loggedUser.id);
      });
    });
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

  describe("Query", () => {
    let randomUser: User;

    beforeAll(async () => {
      randomUser = await UserSeeder.createOne();
      await PictureSeeder.createOne({ userId: randomUser.id });
    });

    describe("userId", () => {
      it("returns pictures from 'userId'", async () => {
        const response = await request(app)
          .get(`/api/pictures?userId=${randomUser.id}`)
          .set("Cookie", adminCookie)
          .send();

        expect(response.status).toEqual(200);
        expect(response.body.pictures).toHaveLength(1);
        expect(response.body.pictures[0].userId).toEqual(randomUser.id);
      });
    });
  });
});
