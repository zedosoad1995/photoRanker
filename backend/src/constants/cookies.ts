import { CookieOptions } from "express";

export let cookieOptions: CookieOptions = {};

if (process.env.NODE_ENV === "STG") {
  cookieOptions = { httpOnly: true, secure: true, sameSite: "none" };
}
