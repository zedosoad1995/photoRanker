const { parse, isValid } = require("date-fns");

export const isValidDateFormat = (dateString: string) => {
  const parsedDate = parse(dateString, "yyyy-MM-dd", new Date());
  const isValidDate = isValid(parsedDate);

  return isValidDate && dateString === parsedDate.toISOString().split("T")[0];
};
