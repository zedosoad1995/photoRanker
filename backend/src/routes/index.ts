import { Router } from "express";
import usersRoute from "./users.route";
import authRoute from "./auth.route";
import picturesRoute from "./pictures.route";

const api = Router()
  .use("/users", usersRoute)
  .use("/auth", authRoute)
  .use("/pictures", picturesRoute);

export default Router().use("/api", api);
