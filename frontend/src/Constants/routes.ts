export const HOME = "/";
export const PRIVACY = "/privacy";
export const TERMS = "/terms";
export const LOGIN = "/login";
export const REGISTER = "/register";
export const EXPIRED_VALIDATION = "/expired-validation";
export const CHECKING_VALIDATION = "/checking-validation";
export const FORGOT_PASSWORD = "/forgot-password";
export const RESET_PASSWORD = "/reset-password";
export const VOTE = "/vote";
export const PHOTOS = "/photos";
export const PHOTO_DETAILS = "/photos/:pictureId";
export const ADMIN_PHOTOS = "/admin/photos";
export const SETTINGS = "/settings";

export const FACEBOOK_CALLBACK = "/auth/facebook";

export const AUTH_ROUTES = [
  VOTE,
  PHOTOS,
  SETTINGS,
  PHOTO_DETAILS,
  ADMIN_PHOTOS,
];

export const PHOTO_DETAILS_PATH = (pictureId: string) => `/photos/${pictureId}`;
