import { parse, isValid, format } from "date-fns";

export const isValidDateFormat = (dateString: string) => {
  const parsedDate = parse(dateString, "yyyy-MM-dd", new Date());
  const isValidDate = isValid(parsedDate);

  return isValidDate;
};

export const formatDate = (date: Date, dateformat: string = "yyyy-MM-dd") => {
  return format(date, dateformat);
};

export const getDateInXHours = (hours: number) => {
  const date = new Date();
  console.log(date.getHours(), date, date.getHours() + hours, hours);
  date.setHours(date.getHours() + hours);

  return date;
};
