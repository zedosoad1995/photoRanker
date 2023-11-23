import { Router, Request, Response } from "express";
import usersRoute from "./users.route";
import authRoute from "./auth.route";
import picturesRoute from "./pictures.route";
import matchesRoute from "./matches.route";
import votesRoute from "./votes.route";
import reportsRoute from "./reports.route";
import paymentsRoute from "./payments.route";
import preferencesRoute from "./preferences.route";

const api = Router()
  .use("/users", usersRoute)
  .use("/auth", authRoute)
  .use("/pictures", picturesRoute)
  .use("/matches", matchesRoute)
  .use("/votes", votesRoute)
  .use("/reports", reportsRoute)
  .use("/preferences", preferencesRoute)
  .use("/payments", paymentsRoute)
  .use("/healthCheck", (req: Request, res: Response) => {
    res.status(200).json({ healthy: true });
  });

export default Router().use("/api", api);
