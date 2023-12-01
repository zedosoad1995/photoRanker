import { checkAuth } from "./checkAuth";
import { checkBanned } from "./checkBanned";
import { checkEmailVerified } from "./checkEmailVerified";
import { checkProfileCompleted } from "./checkProfileCompleted";
import { Request, Response, NextFunction } from "express";

const checkAll = [checkAuth, checkBanned, checkProfileCompleted, checkEmailVerified];

export const checkBasicUserSettings = async (req: Request, res: Response, next: NextFunction) => {
  for (const check of checkAll) {
    let checkPassed = false;
    await check(req, res, () => (checkPassed = true));

    if (!checkPassed) {
      return;
    }
  }

  next();
};
