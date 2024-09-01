import { IMode } from "./mode";

export const DO_NOT_FETCH_PHOTOS = "doNotFetchPhotos";
export const SCROLL_POSITION = "scrollPosition";
export const MODE = "mode";
export const PHOTO_MODE = "photoMode";
export const FILTER_SELECT = (mode: IMode) => "filterSelect " + mode;
export const SORT_VALUE = (mode: IMode) => "sortValue " + mode;
export const GENDER = (mode: IMode) => "gender " + mode;
export const MIN_AGE = (mode: IMode) => "minAge " + mode;
export const MAX_AGE = (mode: IMode) => "maxAge " + mode;
