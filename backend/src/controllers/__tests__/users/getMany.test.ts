import request from "supertest";
import { app } from "@/app";

it("returns a list of users", async () => {
  const response = await request(app).get("/api/tickets").send();

  expect(response.status).toEqual(1);
});
