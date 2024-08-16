export const Mode = {
  Global: "global",
  Personal: "personal",
} as const;

export type IMode = (typeof Mode)[keyof typeof Mode];

export const PhotoMode = {
  Stats: "stats",
  Votes: "votes",
} as const;

export type IPhotoMode = (typeof PhotoMode)[keyof typeof PhotoMode];
