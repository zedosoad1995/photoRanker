import request from "supertest";
import { app } from "@/app";
import { Seeder } from "@/tests/seed/Seeder";

it("returns a list of users", async () => {
  const NUM_USERS = 10;

  await Seeder("User")?.seed({ numRepeat: NUM_USERS });

  const response = await request(app).get("/api/users").send();

  expect(response.status).toEqual(200);
  expect(response.body.users).toHaveLength(NUM_USERS);
});

it("does not return 'password' field", async () => {
  await Seeder("User")?.seed({ numRepeat: 1 });

  const response = await request(app).get("/api/users").send();

  expect(response.status).toEqual(200);
  expect(response.body.users[0]).not.toHaveProperty("password");
});
