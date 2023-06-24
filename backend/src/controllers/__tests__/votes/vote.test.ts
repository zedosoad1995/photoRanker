import request from "supertest";
import { app } from "@/app";
import { Seeder } from "@/tests/seed/Seeder";
import { loginAdmin, loginRegular } from "@/tests/helpers/user";
import { User } from "@prisma/client";
import { MatchSeeder } from "@/tests/seed/MatchSeeder";
import { VoteSeeder } from "@/tests/seed/VoteSeeder";
import { PictureSeeder } from "@/tests/seed/PictureSeeder";
import { UserModel } from "@/models/user";
import { UserSeeder } from "@/tests/seed/UserSeeder";

describe("Unauthorized", () => {
  it("returns 401, when no user is authenticated", async () => {
    const response = await request(app).post("/api/votes").send();

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

  it("throws an error, when match does not exist", async () => {
    const pictures = await (Seeder("Picture") as PictureSeeder).seed({
      data: {
        userId: regularUser.id,
      },
    });

    const response = await request(app)
      .post("/api/votes")
      .set("Cookie", regularCookie)
      .send({
        matchId: "doesNotExist",
        winnerPictureId: pictures[0].id,
      });

    expect(response.status).toEqual(404);
  });

  it("throws an error, when match exists but is inactive", async () => {
    const matches = await (Seeder("Match") as MatchSeeder).seed();
    const pictures = await (Seeder("Picture") as PictureSeeder).seed({
      data: {
        userId: regularUser.id,
      },
    });
    await (Seeder("Vote") as VoteSeeder).seed({
      data: {
        matchId: matches[0].id,
        voterId: regularUser.id,
        winnerPictureId: pictures[0].id,
      },
    });

    const response = await request(app)
      .post("/api/votes")
      .set("Cookie", regularCookie)
      .send({
        matchId: matches[0].id,
        winnerPictureId: pictures[0].id,
      });

    expect(response.status).toEqual(403);
  });

  it("throws an error, when match exists is active, but belongs to another user", async () => {
    const users = await (Seeder("User") as UserSeeder).createMany();
    const matches = await (Seeder("Match") as MatchSeeder).seed();
    const pictures = await (Seeder("Picture") as PictureSeeder).seed({
      data: {
        userId: users[0].id,
      },
    });
    await (Seeder("Vote") as VoteSeeder).seed({
      data: {
        matchId: matches[0].id,
        voterId: users[0].id,
        winnerPictureId: pictures[0].id,
      },
    });

    await UserModel.update({
      where: {
        id: users[0].id,
      },
      data: {
        activeMatch: {
          connect: {
            id: matches[0].id,
          },
        },
      },
    });

    const response = await request(app)
      .post("/api/votes")
      .set("Cookie", regularCookie)
      .send({
        matchId: matches[0].id,
        winnerPictureId: pictures[0].id,
      });

    expect(response.status).toEqual(403);
  });
});
