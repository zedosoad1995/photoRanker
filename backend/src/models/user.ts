import _ from "underscore";
import { User } from "@prisma/client";
import { prisma } from ".";

function dump(user: Partial<User> & Record<string, any>) {
  return _.omit(
    user,
    "password",
    "googleId",
    "facebookId",
    "canBypassPreferences",
    "verificationToken",
    "verificationTokenExpiration",
    "resetPasswordToken",
    "resetPasswordExpiration"
  );
}

function dumpMany(users: (Partial<User> & Record<string, any>)[]) {
  return users.map(dump);
}

export const UserModel = { ...prisma.user, dump, dumpMany };
