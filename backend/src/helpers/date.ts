import { parse, isValid, format } from "date-fns";

export const isValidDateFormat = (dateString: string) => {
  const parsedDate = parse(dateString, "yyyy-MM-dd", new Date());
  const isValidDate = isValid(parsedDate);

  return isValidDate;
};

export const formatDate = (date: Date, dateformat: string = "yyyy-MM-dd") => {
  return format(date, dateformat);
};
