import {
  parse,
  isValid,
  format,
  differenceInYears,
  addYears,
  addMonths,
  addDays,
  addHours,
  addMinutes,
  addSeconds,
} from "date-fns";

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
  date.setHours(date.getHours() + hours);

  return date;
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

interface TimeAdjustments {
  years?: number;
  months?: number;
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
}

export const adjustDate = (date: Date, adjustments: TimeAdjustments): Date => {
  let adjustedDate = date;

  if (adjustments.years) {
    adjustedDate = addYears(adjustedDate, adjustments.years);
  }

  if (adjustments.months) {
    adjustedDate = addMonths(adjustedDate, adjustments.months);
  }

  if (adjustments.days) {
    adjustedDate = addDays(adjustedDate, adjustments.days);
  }

  if (adjustments.hours) {
    adjustedDate = addHours(adjustedDate, adjustments.hours);
  }

  if (adjustments.minutes) {
    adjustedDate = addMinutes(adjustedDate, adjustments.minutes);
  }

  if (adjustments.seconds) {
    adjustedDate = addSeconds(adjustedDate, adjustments.seconds);
  }

  return adjustedDate;
};
