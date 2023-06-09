import request from "supertest";
import { app } from "@/app";
import { Seeder } from "@/tests/seed/Seeder";

const NUM_USERS = 10;

beforeAll(() => {
  return Seeder("User")?.seed({ numRepeat: NUM_USERS });
});

it("returns a list of users", async () => {
  const response = await request(app).get("/api/users").send();

  expect(response.status).toEqual(200);
  expect(response.body.users).toHaveLength(NUM_USERS);
});

it("does not return 'password' field", async () => {
  const response = await request(app).get("/api/users").send();

  expect(response.status).toEqual(200);
  expect(response.body.users[0]).not.toHaveProperty("password");
});
