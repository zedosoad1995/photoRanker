import request from "supertest";
import { app } from "@/app";
import { UserModel } from "@/models/user";
import { loginRegular } from "@/tests/helpers/user";
import { User } from "@prisma/client";
import { mailingService } from "@/container";

describe("Unauthorized", () => {
  it("returns 401, when no user is authenticated", async () => {
    const response = await request(app).post("/api/auth/resend-email").send();

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
  });

  it("returns 400, when email is already verified", async () => {
    const response = await request(app)
      .post("/api/auth/resend-email")
      .set("Cookie", regularCookie)
      .send();

    expect(response.status).toEqual(400);
  });

  it("returns 204 and sends email", async () => {
    await UserModel.update({
      data: {
        isEmailVerified: false,
      },
      where: {
        id: regularUser.id,
      },
    });

    const response = await request(app)
      .post("/api/auth/resend-email")
      .set("Cookie", regularCookie)
      .send();

    expect(response.status).toEqual(204);
    expect(mailingService.sendEmail).toHaveBeenCalledTimes(1);
    expect(mailingService.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: regularUser.email,
      })
    );
  });
});

describe("Admin Logged User", () => {
  let adminCookie: string;
  let adminUser: User;

  beforeEach(async () => {
    const res = await loginRegular();
    adminCookie = res.cookie;
    adminUser = res.user;
  });

  it("returns 204 and sends email", async () => {
    await UserModel.update({
      data: {
        isEmailVerified: false,
      },
      where: {
        id: adminUser.id,
      },
    });

    const response = await request(app)
      .post("/api/auth/resend-email")
      .set("Cookie", adminCookie)
      .send();

    expect(response.status).toEqual(204);
    expect(mailingService.sendEmail).toHaveBeenCalledTimes(1);
    expect(mailingService.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: adminUser.email,
      })
    );
  });
});
