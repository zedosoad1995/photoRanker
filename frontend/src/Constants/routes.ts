export const HOME = "/";
export const LOGIN = "/login";
export const REGISTER = "/register";
export const EXPIRED_VALIDATION = "/expired-validation";
export const CHECKING_VALIDATION = "/checking-validation";
export const FORGOT_PASSWORD = "/forgot-password";
export const RESET_PASSWORD = "/reset-password";
export const VOTE = "/vote";
export const PHOTOS = "/photos";
export const SETTINGS = "/settings";

export const FACEBOOK_CALLBACK = "/auth/facebook";

export const NON_AUTH_ROUTES = [
  HOME,
  LOGIN,
  REGISTER,
  EXPIRED_VALIDATION,
  `${CHECKING_VALIDATION}/*`,
  FORGOT_PASSWORD,
  `${RESET_PASSWORD}/*`,
  FACEBOOK_CALLBACK,
];
