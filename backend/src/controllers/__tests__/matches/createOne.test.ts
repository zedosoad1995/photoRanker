import _ from "underscore";
import request from "supertest";
import { app } from "@/app";
import { loginAdmin, loginRegular } from "@/tests/helpers/user";
import { User } from "@prisma/client";
import { UserSeeder } from "@/tests/seed/UserSeeder";
import { PictureSeeder } from "@/tests/seed/PictureSeeder";
import { MatchModel } from "@/models/match";
import { MatchSeeder } from "@/tests/seed/MatchSeeder";

let otherUser: User;

beforeAll(async () => {
  const users = await UserSeeder.createMany();
  otherUser = users[0];
});

describe("Unauthorized", () => {
  it("returns 401, when no user is authenticated", async () => {
    const response = await request(app).post("/api/matches").send();

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

  it("throws and error, when there are less than 2 pictures belonging to other users", async () => {
    await PictureSeeder.seed({
      data: {
        userId: regularUser.id,
      },
      numRepeat: 5,
    });
    await PictureSeeder.createMany({
      data: {
        userId: otherUser.id,
      },
    });

    const response = await request(app)
      .post("/api/matches")
      .set("Cookie", regularCookie)
      .send();

    expect(response.status).toEqual(400);
  });

  it("creates new match, with activeUser not null", async () => {
    await PictureSeeder.seed({
      data: {
        userId: otherUser.id,
      },
      numRepeat: 2,
    });

    const response = await request(app)
      .post("/api/matches")
      .set("Cookie", regularCookie)
      .send();

    expect(response.status).toEqual(201);
    expect(response.body.match).toBeTruthy();

    const match = await MatchModel.findUnique({
      where: {
        id: response.body.match.id,
      },
      include: {
        activeUser: true,
      },
    });

    expect(match).toBeTruthy();
    expect(match?.activeUser).toBeTruthy();
  });

  it("creates new match, deletes active match belonging to logged user, ignores active matches from other users", async () => {
    await PictureSeeder.seed({
      data: {
        userId: otherUser.id,
      },
      numRepeat: 2,
    });

    const matchesOtherUser = await MatchSeeder.seed({
      data: {
        activeUser: {
          connect: {
            id: otherUser.id,
          },
        },
      },
    });

    const matchesLoggedUser = await MatchSeeder.createMany({
      data: {
        activeUser: {
          connect: {
            id: regularUser.id,
          },
        },
      },
    });

    const response = await request(app)
      .post("/api/matches")
      .set("Cookie", regularCookie)
      .send();

    expect(response.status).toEqual(201);

    const matchOtherUser = await MatchModel.findUnique({
      where: {
        id: matchesOtherUser[0].id,
      },
    });
    const matchLoggedUser = await MatchModel.findUnique({
      where: {
        id: matchesLoggedUser[0].id,
      },
    });

    expect(matchOtherUser).toBeTruthy();
    expect(matchLoggedUser).toBeFalsy();
  });
});

describe("Admin Logged User", () => {
  let adminCookie: string;

  beforeAll(async () => {
    const res = await loginAdmin();
    adminCookie = res.cookie;
  });

  it("creates new match", async () => {
    await PictureSeeder.seed({
      data: {
        userId: otherUser.id,
      },
      numRepeat: 2,
    });

    const response = await request(app)
      .post("/api/matches")
      .set("Cookie", adminCookie)
      .send();

    expect(response.status).toEqual(201);
  });
});
