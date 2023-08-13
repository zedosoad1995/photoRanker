export const ORDER_BY_DIR = {
  ASC: "asc",
  DESC: "desc",
} as const;

export type ORDER_BY_DIR_OPTIONS_TYPE = (typeof ORDER_BY_DIR)[keyof typeof ORDER_BY_DIR];
