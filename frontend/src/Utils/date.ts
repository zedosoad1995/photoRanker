import { subYears } from "date-fns";

export const subtractYears = (date: Date, years: number) => {
  return subYears(date, years);
};
