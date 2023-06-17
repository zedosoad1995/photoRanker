import { Router } from "express";
import usersRoute from "./users.route";
import authRoute from "./auth.route";

const api = Router().use("/users", usersRoute).use("/auth", authRoute);

export default Router().use("/api", api);
