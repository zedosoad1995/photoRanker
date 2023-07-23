import { subYears, parse, differenceInYears } from "date-fns";

export const subtractYears = (date: Date, years: number) => {
  return subYears(date, years);
};

export const calculateAge = (date: string) => {
  const birthDate = parse(date, "yyyy-MM-dd", new Date());

  const age = differenceInYears(new Date(), birthDate);

  return age;
};
