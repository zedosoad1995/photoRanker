import { subYears, parseISO, isValid } from "date-fns";

export const subtractYears = (date: Date, years: number) => {
  return subYears(date, years);
};

export const extractDayMonthYearFromDate = (date: string) => {
  const splitDate = date.split("-").map(Number);
  if (splitDate.length !== 3) {
    return { day: undefined, month: undefined, year: undefined };
  }

  const day = splitDate[2];
  const month = splitDate[1];
  const year = splitDate[0];

  for (const value of [day, month, year]) {
    if (isNaN(value)) {
      return { day: undefined, month: undefined, year: undefined };
    }
  }

  return { day, month, year };
};

export const isYMDFormat = (dateString: string): boolean => {
  const date = parseISO(dateString);
  return isValid(date);
};
