import { CookieOptions } from "express";

export let cookieOptions: CookieOptions = {};

cookieOptions = { httpOnly: true, secure: true, sameSite: "none" };
