import request from "supertest";
import { app } from "@/app";
import { UserSeeder } from "@/tests/seed/UserSeeder";

it("returns false, when email does not exist", async () => {
  await UserSeeder.deleteAll();

  const response = await request(app)
    .post("/api/users/check-email")
    .send({ email: "new@email.com" });

  expect(response.status).toEqual(200);
  expect(response.body.exists).toEqual(false);
});

it("returns true, when email already exist", async () => {
  const user = await UserSeeder.seedOne();

  const response = await request(app)
    .post("/api/users/check-email")
    .send({ email: user.email });

  expect(response.status).toEqual(200);
  expect(response.body.exists).toEqual(true);
});

describe("Test Validation", () => {
  beforeEach(async () => {
    await UserSeeder.deleteAll();
  });

  it("must use valid propriety name", async () => {
    const response = await request(app)
      .post("/api/users/check-email")
      .send({ emaill: "email@email.com" });

    expect(response.status).toEqual(422);
  });

  describe("'email' field", () => {
    it("is required", async () => {
      const response = await request(app)
        .post("/api/users/check-email")
        .send({});

      expect(response.status).toEqual(422);
    });

    it("is not string", async () => {
      const response = await request(app)
        .post("/api/users/check-email")
        .send({ email: 123 });

      expect(response.status).toEqual(422);
    });
  });
});
