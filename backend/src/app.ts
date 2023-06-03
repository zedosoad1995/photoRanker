import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import { NotFoundError } from "./errors/NotFoundError";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();
app.use(json());

app.all("*", async (req, res) => {
  throw new NotFoundError("Invalid route path");
});

app.use(errorHandler);

export { app };
