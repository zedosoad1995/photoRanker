import request from "supertest";
import { app } from "@/app";
import { Seeder } from "@/tests/seed/Seeder";
import { loginAdmin, loginRegular } from "@/tests/helpers/user";
import { PictureSeeder } from "@/tests/seed/PictureSeeder";

const NUM_PICTURES = 10;

let adminCookie: string;

describe("Unauthorized", () => {
  it("returns 401, when no user is authenticated", async () => {
    const response = await request(app).get("/api/pictures").send();

    expect(response.status).toEqual(401);
  });
});

describe("Admin Logged User", () => {
  beforeAll(async () => {
    const res = await loginAdmin();
    adminCookie = res.cookie;

    await (Seeder("Picture") as PictureSeeder).seed({data: {userId: res.user.id}, numRepeat: NUM_PICTURES})
  });

  it("returns a list of pictures", async () => {
    const response = await request(app)
      .get("/api/pictures")
      .set("Cookie", adminCookie)
      .send();

    expect(response.status).toEqual(200);
    expect(response.body.pictures).toHaveLength(NUM_PICTURES);
  });
});
