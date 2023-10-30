export const Mode = {
  Global: "global",
  Personal: "personal",
} as const;

export type IMode = (typeof Mode)[keyof typeof Mode];
