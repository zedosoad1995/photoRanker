import express from "express";
import "express-async-errors";
import cookieParser from "cookie-parser";
import { NotFoundError } from "@/errors/NotFoundError";
import { errorHandler } from "@/middlewares/errorHandler";
import routes from "@/routes";
import cors from "cors";
import { IMAGES_FOLDER_PATH } from "./constants/picture";
import { jsonBodyParser } from "./middlewares/bodyParser";

const app = express();

app.use(jsonBodyParser);
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
  })
);
app.use("/image", express.static(IMAGES_FOLDER_PATH));
app.use(routes);
app.all("*", async (req, res) => {
  throw new NotFoundError("Invalid route path");
});

app.use(errorHandler);

export { app };
