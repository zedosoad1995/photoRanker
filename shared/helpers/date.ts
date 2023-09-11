import { parse, isValid, differenceInYears } from "date-fns";

export const isValidDateFormat = (dateString: string) => {
  const parsedDate = parse(dateString, "yyyy-MM-dd", new Date());
  const isValidDate = isValid(parsedDate);

  return isValidDate;
};

export const calculateAge = (dateString: string) => {
  const parsedDate = parse(dateString, "yyyy-MM-dd", new Date());

  const age = differenceInYears(new Date(), parsedDate);

  return age;
};

export const isAboveAge = (minAgeAllowed: number) => (dateString: string) => {
  const age = calculateAge(dateString);

  return age >= minAgeAllowed;
};
