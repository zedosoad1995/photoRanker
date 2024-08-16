export const HOME = "/";
export const LOGIN = "/login";
export const REGISTER = "/register";
export const EXPIRED_VALIDATION = "/expired-validation";
export const CHECKING_VALIDATION = "/checking-validation";
export const FORGOT_PASSWORD = "/forgot-password";
export const RESET_PASSWORD = "/reset-password";
export const VOTE = "/vote";
export const PHOTOS = "/photos";
export const PHOTO_VOTING_STATS = "/photos/:pictureId/lala-stats";
export const PHOTO_STATS = "/photos/:pictureId/stats";
export const SETTINGS = "/settings";

export const FACEBOOK_CALLBACK = "/auth/facebook";

export const AUTH_ROUTES = [VOTE, PHOTOS, SETTINGS];

export const PHOTO_VOTING_STATS_PATH = (pictureId: string) =>
  `/photos/${pictureId}/stats`;
