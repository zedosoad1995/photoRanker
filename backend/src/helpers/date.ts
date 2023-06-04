import { parse, isValid } from "date-fns";

export const isValidDateFormat = (dateString: string) => {
  const parsedDate = parse(dateString, "yyyy-MM-dd", new Date());
  const isValidDate = isValid(parsedDate);

  return isValidDate;
};
