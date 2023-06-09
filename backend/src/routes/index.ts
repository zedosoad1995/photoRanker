import { Router } from "express";
import usersRoute from "./users.route";

const api = Router().use("/users", usersRoute);

export default Router().use("/api", api);
