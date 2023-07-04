import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";
import { json } from "body-parser";
import { NotFoundError } from "@/errors/NotFoundError";
import { errorHandler } from "@/middlewares/errorHandler";
import routes from "@/routes";
import cors from "cors";

const app = express();
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  })
);
app.use(routes);

app.all("*", async (req, res) => {
  throw new NotFoundError("Invalid route path");
});

app.use(errorHandler);

export { app };
