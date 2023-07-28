import request from "supertest";
import { app } from "@/app";
import { loginAdmin, loginRegular } from "@/tests/helpers/user";
import { User } from "@prisma/client";
import { MatchSeeder } from "@/tests/seed/MatchSeeder";
import { VoteSeeder } from "@/tests/seed/VoteSeeder";
import { PictureSeeder } from "@/tests/seed/PictureSeeder";
import { UserModel } from "@/models/user";
import { UserSeeder } from "@/tests/seed/UserSeeder";
import { VoteModel } from "@/models/vote";
import { MatchModel } from "@/models/match";
import { rimrafSync } from "rimraf";
import { TEST_IMAGES_FOLDER_PATH } from "@/constants/picture";

beforeEach(() => {
  rimrafSync(TEST_IMAGES_FOLDER_PATH + "/*", { glob: true });
});

afterAll(() => {
  rimrafSync(TEST_IMAGES_FOLDER_PATH + "/*", { glob: true });
});

describe("Unauthorized", () => {
  it("returns 401, when no user is authenticated", async () => {
    const response = await request(app).post("/api/votes").send();

    expect(response.status).toEqual(401);
  });
});

describe("Regular Logged User", () => {
  let regularCookie: string;
  let regularUser: User;

  beforeEach(async () => {
    const res = await loginRegular();
    regularCookie = res.cookie;
    regularUser = res.user;

    await UserModel.update({
      data: {
        isProfileCompleted: true,
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

    const response = await request(app).post("/api/votes").set("Cookie", regularCookie).send();

    expect(response.status).toEqual(403);
  });

  it("throws an error, when match does not exist", async () => {
    const picture = await PictureSeeder.seedOne({
      userId: regularUser.id,
    });

    const response = await request(app).post("/api/votes").set("Cookie", regularCookie).send({
      matchId: "doesNotExist",
      winnerPictureId: picture.id,
    });

    expect(response.status).toEqual(404);
  });

  it("throws an error, when match exists but is inactive", async () => {
    const match = await MatchSeeder.seedOne();
    const matchId = match.id;

    const picture = await PictureSeeder.seedOne({
      userId: regularUser.id,
    });
    await VoteSeeder.seedOne({
      matchId,
      voterId: regularUser.id,
      winnerPictureId: picture.id,
    });

    const response = await request(app).post("/api/votes").set("Cookie", regularCookie).send({
      matchId,
      winnerPictureId: picture.id,
    });

    expect(response.status).toEqual(403);
  });

  it("throws an error, when match exists is active, but belongs to another user", async () => {
    const user = await UserSeeder.createOne();
    const userId = user.id;

    const match = await MatchSeeder.seedOne();
    const matchId = match.id;

    const picture = await PictureSeeder.seedOne({
      userId,
    });
    await VoteSeeder.seedOne({
      matchId,
      voterId: userId,
      winnerPictureId: picture.id,
    });

    await UserModel.update({
      where: {
        id: userId,
      },
      data: {
        activeMatchId: matchId,
      },
    });

    const response = await request(app).post("/api/votes").set("Cookie", regularCookie).send({
      matchId,
      winnerPictureId: picture.id,
    });

    expect(response.status).toEqual(403);
  });

  it("throws an error, when winning picture does not exist", async () => {
    const match = await MatchSeeder.seedOne();
    const matchId = match.id;

    await UserModel.update({
      where: {
        id: regularUser.id,
      },
      data: {
        activeMatchId: matchId,
      },
    });

    const response = await request(app).post("/api/votes").set("Cookie", regularCookie).send({
      matchId: matchId,
      winnerPictureId: "doesNotExist",
    });

    expect(response.status).toEqual(404);
  });

  it("throws an error, when winning picture exists, but belongs to another match", async () => {
    const pictures = await PictureSeeder.seedMany({
      data: {
        userId: regularUser.id,
      },
      numRepeat: 2,
    });

    const matches = await MatchSeeder.seedMany({
      data: [
        {
          pictures: {
            connect: {
              id: pictures[0].id,
            },
          },
        },
        {
          pictures: {
            connect: {
              id: pictures[1].id,
            },
          },
        },
      ],
    });

    await UserModel.update({
      where: {
        id: regularUser.id,
      },
      data: {
        activeMatchId: matches[0].id,
      },
    });

    const response = await request(app).post("/api/votes").set("Cookie", regularCookie).send({
      matchId: matches[0].id,
      winnerPictureId: pictures[1].id,
    });

    expect(response.status).toEqual(404);
  });

  describe("Success cases", () => {
    let matchId: string;
    let winnerPictureId: string;
    const INITIAL_ELO = 0;
    const INITIAL_NUM_VOTES = 0;

    beforeEach(async () => {
      const pictures = await PictureSeeder.seedMany({
        data: {
          userId: regularUser.id,
          elo: INITIAL_ELO,
          numVotes: INITIAL_NUM_VOTES,
        },
        numRepeat: 2,
      });

      const match = await MatchSeeder.seedOne({
        pictures: {
          connect: pictures.map((picture) => ({ id: picture.id })),
        },
      });

      matchId = match.id;
      winnerPictureId = pictures[0].id;

      await UserModel.update({
        where: {
          id: regularUser.id,
        },
        data: {
          activeMatchId: matchId,
        },
      });
    });

    it("creates a new vote, and assigns the winning picture", async () => {
      const response = await request(app).post("/api/votes").set("Cookie", regularCookie).send({
        matchId,
        winnerPictureId,
      });

      expect(response.status).toEqual(201);
      expect(response.body.vote.winnerPictureId).toEqual(winnerPictureId);

      const createdVote = await VoteModel.findUnique({
        where: {
          id: response.body.vote.id,
        },
      });

      expect(createdVote?.winnerPictureId).toEqual(winnerPictureId);
    });

    it("turns match inactive", async () => {
      await request(app).post("/api/votes").set("Cookie", regularCookie).send({
        matchId,
        winnerPictureId,
      });

      const match = await MatchModel.findUnique({
        where: {
          id: matchId,
        },
        include: {
          activeUser: true,
        },
      });

      expect(match?.activeUser).toBeFalsy();
    });

    it("updates the rating from the pictures in the match", async () => {
      await request(app).post("/api/votes").set("Cookie", regularCookie).send({
        matchId,
        winnerPictureId,
      });

      const match = await MatchModel.findUnique({
        where: {
          id: matchId,
        },
        include: {
          pictures: true,
        },
      });

      const winnerPicture = match?.pictures.find((picture) => picture.id === winnerPictureId);
      const loserPicture = match?.pictures.find((picture) => picture.id !== winnerPictureId);

      expect(winnerPicture?.elo).toBeGreaterThan(INITIAL_ELO);
      expect(loserPicture?.elo).toBeLessThan(INITIAL_ELO);
      expect(winnerPicture?.numVotes).toEqual(INITIAL_NUM_VOTES + 1);
      expect(loserPicture?.numVotes).toEqual(INITIAL_NUM_VOTES + 1);
    });
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

  it("creates a new vote", async () => {
    const pictures = await PictureSeeder.seedMany({
      data: {
        userId: adminUser.id,
      },
      numRepeat: 2,
    });

    const match = await MatchSeeder.seedOne({
      pictures: {
        connect: pictures.map((picture) => ({ id: picture.id })),
      },
    });

    const matchId = match.id;
    const winnerPictureId = pictures[0].id;

    await UserModel.update({
      where: {
        id: adminUser.id,
      },
      data: {
        activeMatchId: matchId,
      },
    });

    const response = await request(app).post("/api/votes").set("Cookie", adminCookie).send({
      matchId,
      winnerPictureId,
    });

    expect(response.status).toEqual(201);
  });
});
