import request from "supertest";
import { app } from "@/app";
import { loginAdmin, loginRegular } from "@/tests/helpers/user";
import { PictureSeeder } from "@/tests/seed/PictureSeeder";
import { UserSeeder } from "@/tests/seed/UserSeeder";
import { User } from "@prisma/client";
import { rimrafSync } from "rimraf";
import { TEST_IMAGES_FOLDER_PATH } from "@/constants/picture";
import { UserModel } from "@/models/user";
import { ReportSeeder } from "@/tests/seed/ReportSeeder";

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

    const response = await request(app).get("/api/pictures").set("Cookie", regularCookie).send();

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

    const response = await request(app).get("/api/pictures").set("Cookie", regularCookie).send();

    expect(response.status).toEqual(403);
  });

  it("returns a list of pictures belonging to logged user", async () => {
    const response = await request(app).get("/api/pictures").set("Cookie", regularCookie).send();

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
  let adminUserId: string;

  beforeAll(async () => {
    const res = await loginAdmin();
    adminCookie = res.cookie;
    adminUserId = res.user.id;

    await PictureSeeder.seedMany({
      data: { userId: res.user.id },
      numRepeat: NUM_PICTURES,
    });
  });

  it("returns a list of pictures", async () => {
    const response = await request(app).get("/api/pictures").set("Cookie", adminCookie).send();

    expect(response.status).toEqual(200);
    expect(response.body.pictures).toHaveLength(NUM_PICTURES);
  });

  describe("Query", () => {
    describe("userId", () => {
      let randomUser: User;

      beforeAll(async () => {
        randomUser = await UserSeeder.createOne();
        await PictureSeeder.createOne({ userId: randomUser.id });
      });

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

    describe("hasReport", () => {
      beforeAll(async () => {
        const pictures = await PictureSeeder.seedMany({
          data: { userId: adminUserId },
          numRepeat: 3,
        });

        await ReportSeeder.seedOne({
          picture: {
            connect: {
              id: pictures[0].id,
            },
          },
          userReporting: {
            connect: {
              id: adminUserId,
            },
          },
        });
      });

      it("throws error, when 'hasReport' is an array", async () => {
        const response = await request(app)
          .get(`/api/pictures?hasReport=true&hasReport=false`)
          .set("Cookie", adminCookie)
          .send();

        expect(response.status).toEqual(422);
      });

      it("throws error, when 'userId' has an invalid value", async () => {
        const response = await request(app)
          .get(`/api/pictures?hasReport=TRUE`)
          .set("Cookie", adminCookie)
          .send();

        expect(response.status).toEqual(422);
      });

      it("Returns all pictures, if hasReports is undefined", async () => {
        for (const url of ["/api/pictures?hasReport=", "/api/pictures"]) {
          const response = await request(app).get(url).set("Cookie", adminCookie).send();

          expect(response.status).toEqual(200);
          expect(response.body.pictures).toHaveLength(3);
        }
      });

      it("Returns reported pictures, if hasReports is true", async () => {
        const response = await request(app)
          .get("/api/pictures?hasReport=true")
          .set("Cookie", adminCookie)
          .send();

        expect(response.status).toEqual(200);
        expect(response.body.pictures).toHaveLength(1);
      });

      it("Returns non-reported pictures, if hasReports is false", async () => {
        const response = await request(app)
          .get("/api/pictures?hasReport=false")
          .set("Cookie", adminCookie)
          .send();

        expect(response.status).toEqual(200);
        expect(response.body.pictures).toHaveLength(2);
      });
    });

    describe("belongsToMe", () => {
      beforeAll(async () => {
        const randomUser = await UserSeeder.createOne();

        await PictureSeeder.seedOne({ userId: randomUser.id });
        await PictureSeeder.createMany({
          data: {
            userId: adminUserId,
          },
          numRepeat: 2,
        });
      });

      it("throws error, when 'belongsToMe' is an array", async () => {
        const response = await request(app)
          .get(`/api/pictures?belongsToMe=true&belongsToMe=false`)
          .set("Cookie", adminCookie)
          .send();

        expect(response.status).toEqual(422);
      });

      it("throws error, when 'belongsToMe' has an invalid value", async () => {
        const response = await request(app)
          .get(`/api/pictures?belongsToMe=TRUE`)
          .set("Cookie", adminCookie)
          .send();

        expect(response.status).toEqual(422);
      });

      it("Returns all pictures, if belongsToMe is undefined", async () => {
        for (const url of ["/api/pictures?belongsToMe=", "/api/pictures"]) {
          const response = await request(app).get(url).set("Cookie", adminCookie).send();

          expect(response.status).toEqual(200);
          expect(response.body.pictures).toHaveLength(3);
        }
      });

      it("Returns loggedUser pictures, if belongsToMe is true", async () => {
        const response = await request(app)
          .get("/api/pictures?belongsToMe=true")
          .set("Cookie", adminCookie)
          .send();

        expect(response.status).toEqual(200);
        expect(response.body.pictures).toHaveLength(2);
      });

      it("Returns non-loggedUser pictures, if belongsToMe is false", async () => {
        const response = await request(app)
          .get("/api/pictures?belongsToMe=false")
          .set("Cookie", adminCookie)
          .send();

        expect(response.status).toEqual(200);
        expect(response.body.pictures).toHaveLength(1);
      });
    });

    describe("isBanned", () => {
      beforeAll(async () => {
        const randomUser = await UserSeeder.createOne({ isBanned: true });

        await PictureSeeder.seedOne({ userId: randomUser.id });
        await PictureSeeder.createMany({
          data: {
            userId: adminUserId,
          },
          numRepeat: 2,
        });
      });

      it("throws error, when 'isBanned' is an array", async () => {
        const response = await request(app)
          .get(`/api/pictures?isBanned=true&isBanned=false`)
          .set("Cookie", adminCookie)
          .send();

        expect(response.status).toEqual(422);
      });

      it("throws error, when 'isBanned' has an invalid value", async () => {
        const response = await request(app)
          .get(`/api/pictures?isBanned=TRUE`)
          .set("Cookie", adminCookie)
          .send();

        expect(response.status).toEqual(422);
      });

      it("Returns non-banned pictures, if isBanned is undefined", async () => {
        for (const url of ["/api/pictures?isBanned=", "/api/pictures"]) {
          const response = await request(app).get(url).set("Cookie", adminCookie).send();

          expect(response.status).toEqual(200);
          expect(response.body.pictures).toHaveLength(2);
        }
      });

      it("Returns banned pictures, if isBanned is true", async () => {
        const response = await request(app)
          .get("/api/pictures?isBanned=true")
          .set("Cookie", adminCookie)
          .send();

        expect(response.status).toEqual(200);
        expect(response.body.pictures).toHaveLength(1);
      });

      it("Returns non-isBanned pictures, if isBanned is false", async () => {
        const response = await request(app)
          .get("/api/pictures?isBanned=false")
          .set("Cookie", adminCookie)
          .send();

        expect(response.status).toEqual(200);
        expect(response.body.pictures).toHaveLength(2);
      });
    });
  });
});

it.todo("Order By Query tests");
