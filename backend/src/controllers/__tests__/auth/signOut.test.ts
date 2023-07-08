import request from "supertest";
import { app } from "@/app";
import { loginAdmin } from "@/tests/helpers/user";

it("Removes 'session' from the cookie", async () => {
  const { cookie } = await loginAdmin();

  const response = await request(app).post("/api/auth/logout").set("Cookie", cookie).send();

  expect(response.header["set-cookie"][0].includes("session=;")).toBeTruthy();
  expect(response.status).toEqual(204);
});

it("Returns 204, when there is no logged user", async () => {
  const response = await request(app).post("/api/auth/logout").send();

  expect(response.status).toEqual(204);
});
