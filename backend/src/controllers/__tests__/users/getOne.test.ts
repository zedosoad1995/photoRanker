import request from "supertest";
import { app } from "@/app";
import { Seeder } from "@/tests/seed/Seeder";

let userId: string;

beforeAll(async () => {
  const user = await Seeder("User")?.seed({ numRepeat: 1 });

  if (user) {
    userId = user[0].id;
  }
});

it("returns 404, when user id does not exist", async () => {
  const response = await request(app).get("/api/users/doesnotexist").send();

  expect(response.status).toEqual(404);
});

it("returns user", async () => {
  const response = await request(app).get(`/api/users/${userId}`).send();

  expect(response.status).toEqual(200);
  expect(response.body.user.id).toEqual(userId);
});

it("does not return 'password' field", async () => {
  const response = await request(app).get(`/api/users/${userId}`).send();

  expect(response.body.user).not.toHaveProperty("password");
});
