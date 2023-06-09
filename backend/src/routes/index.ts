import { Router } from "express";
import usersRoute from "./users.route";
import authRoute from "./auth.route";
import picturesRoute from "./pictures.route";
import matchesRoute from "./matches.route";
import votesRoute from "./votes.route";

const api = Router()
  .use("/users", usersRoute)
  .use("/auth", authRoute)
  .use("/pictures", picturesRoute)
  .use("/matches", matchesRoute)
  .use("/votes", votesRoute);

export default Router().use("/api", api);
