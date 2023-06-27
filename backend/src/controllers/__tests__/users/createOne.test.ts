import _ from "underscore";
import request from "supertest";
import { app } from "@/app";
import { UserModel } from "@/models/user";
import { loginAdmin, loginRegular, randomizeUser } from "@/tests/helpers/user";
import { UserRole } from "@prisma/client";
import { UserSeeder } from "@/tests/seed/UserSeeder";

const createUserBody = randomizeUser();

describe("Unauthorized", () => {
  it("returns 401, when no user is authenticated", async () => {
    const response = await request(app).post("/api/users").send(createUserBody);

    expect(response.status).toEqual(401);
  });

  it("returns 403, when logged user is not ADMIN", async () => {
    const { cookie } = await loginRegular();

    const response = await request(app)
      .post("/api/users")
      .set("Cookie", cookie)
      .send(createUserBody);

    expect(response.status).toEqual(403);
  });
});

describe("Admin Logged User", () => {
  it("creates a new user, 'password' is not returned, 'role' is REGULAR", async () => {
    await UserSeeder.deleteAll();

    const { cookie } = await loginAdmin();

    const response = await request(app)
      .post("/api/users")
      .set("Cookie", cookie)
      .send(createUserBody);

    expect(response.status).toEqual(201);
    expect(response.body.user).not.toHaveProperty("password");
    expect(response.body.user.role).toEqual(UserRole.REGULAR);

    const numUsers = await UserModel.count();
    expect(numUsers).toBe(2);
  });

  it("returns 409, when 'email' already exists", async () => {
    await UserSeeder.seedOne({ email: createUserBody.email });

    const { cookie } = await loginAdmin();

    const response = await request(app)
      .post("/api/users")
      .set("Cookie", cookie)
      .send(createUserBody);

    expect(response.status).toEqual(409);
  });

  describe("Test Validation", () => {
    let cookie: string;

    beforeEach(async () => {
      await UserSeeder.deleteAll();
      const res = await loginAdmin();
      cookie = res.cookie;
    });

    it("must use valid propriety name", async () => {
      const body = { ...createUserBody, role: UserRole.ADMIN };

      const response = await request(app)
        .post("/api/users")
        .set("Cookie", cookie)
        .send(body);

      expect(response.status).toEqual(422);
    });

    describe("'name' field", () => {
      it("is required", async () => {
        const body = _.omit(createUserBody, "name");

        const response = await request(app)
          .post("/api/users")
          .set("Cookie", cookie)
          .send(body);

        expect(response.status).toEqual(422);
      });

      it("is empty", async () => {
        const body = {
          ...createUserBody,
          name: "",
        };

        const response = await request(app)
          .post("/api/users")
          .set("Cookie", cookie)
          .send(body);

        expect(response.status).toEqual(422);
      });

      it("is too long", async () => {
        const body = {
          ...createUserBody,
          name: "a".repeat(100),
        };

        const response = await request(app)
          .post("/api/users")
          .set("Cookie", cookie)
          .send(body);

        expect(response.status).toEqual(422);
      });
    });

    describe("'email' field", () => {
      it("is required", async () => {
        const body = _.omit(createUserBody, "email");

        const response = await request(app)
          .post("/api/users")
          .set("Cookie", cookie)
          .send(body);

        expect(response.status).toEqual(422);
      });

      it("has invalid email format", async () => {
        const body = {
          ...createUserBody,
          email: "invalid",
        };

        const response = await request(app)
          .post("/api/users")
          .set("Cookie", cookie)
          .send(body);

        expect(response.status).toEqual(422);
      });
    });

    describe("'password' field", () => {
      it("is required", async () => {
        const body = _.omit(createUserBody, "password");

        const response = await request(app)
          .post("/api/users")
          .set("Cookie", cookie)
          .send(body);

        expect(response.status).toEqual(422);
      });

      it("is too short", async () => {
        const body = {
          ...createUserBody,
          password: "ab",
        };

        const response = await request(app)
          .post("/api/users")
          .set("Cookie", cookie)
          .send(body);

        expect(response.status).toEqual(422);
      });

      it("is too long", async () => {
        const body = {
          ...createUserBody,
          password: "a".repeat(50),
        };

        const response = await request(app)
          .post("/api/users")
          .set("Cookie", cookie)
          .send(body);

        expect(response.status).toEqual(422);
      });
    });

    describe("'countryOfOrigin' field", () => {
      it("is required", async () => {
        const body = _.omit(createUserBody, "countryOfOrigin");

        const response = await request(app)
          .post("/api/users")
          .set("Cookie", cookie)
          .send(body);

        expect(response.status).toEqual(422);
      });

      it("is an invalid country name", async () => {
        const body = {
          ...createUserBody,
          countryOfOrigin: "invalid",
        };

        const response = await request(app)
          .post("/api/users")
          .set("Cookie", cookie)
          .send(body);

        expect(response.status).toEqual(422);
      });
    });

    describe("'ethnicity' field", () => {
      it("is required", async () => {
        const body = _.omit(createUserBody, "ethnicity");

        const response = await request(app)
          .post("/api/users")
          .set("Cookie", cookie)
          .send(body);

        expect(response.status).toEqual(422);
      });

      it("is an invalid ethnicity name", async () => {
        const body = {
          ...createUserBody,
          ethnicity: "invalid",
        };

        const response = await request(app)
          .post("/api/users")
          .set("Cookie", cookie)
          .send(body);

        expect(response.status).toEqual(422);
      });
    });

    describe("'dateOfBirth' field", () => {
      it("is required", async () => {
        const body = _.omit(createUserBody, "dateOfBirth");

        const response = await request(app)
          .post("/api/users")
          .set("Cookie", cookie)
          .send(body);

        expect(response.status).toEqual(422);
      });

      it("is has an invalid format, should be yyyy-MM-dd", async () => {
        const body = {
          ...createUserBody,
          dateOfBirth: "2020/01/01",
        };

        const response = await request(app)
          .post("/api/users")
          .set("Cookie", cookie)
          .send(body);

        expect(response.status).toEqual(422);
      });

      it("is has a valid format, but the date is invalid", async () => {
        const body = {
          ...createUserBody,
          dateOfBirth: "2020-02-30",
        };

        const response = await request(app)
          .post("/api/users")
          .set("Cookie", cookie)
          .send(body);

        expect(response.status).toEqual(422);
      });
    });
  });
});
