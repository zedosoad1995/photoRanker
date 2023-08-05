import { MIN_AGE } from "../../../backend/src/constants/user";

export const AGE_OPTIONS = [
  ...Array.from({ length: 100 - MIN_AGE }, (_, index) => (index + MIN_AGE).toString()),
  "100+",
];
