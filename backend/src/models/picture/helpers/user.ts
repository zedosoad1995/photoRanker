import { AGE_GROUPS } from "@/constants/user";
import { adjustDate, formatDate } from "@/helpers/date";
import { calculateAge } from "@shared/helpers/date";

const getAgeQuery = (field: string, minAge: number, maxAge?: number) => {
  const query = `${field} < '${formatDate(adjustDate(new Date(), { years: -minAge, days: 1 }))}'`;

  if (maxAge === undefined) {
    return query;
  }

  return `${query} AND 
      ${field} > '${formatDate(adjustDate(new Date(), { years: -maxAge - 1 }))}'`;
};

export const getAgeGroupQuery = (dateOfBirth: string, dateOfBirthField: string) => {
  const userAge = calculateAge(dateOfBirth);
  const ageGroup = AGE_GROUPS.find(
    (row) => userAge >= row.min && (row.max === undefined || userAge <= row.max),
  );
  if (ageGroup === undefined) {
    throw new Error(`No age group found for user age of ${userAge}`);
  }

  return [getAgeQuery(dateOfBirthField, ageGroup.min, ageGroup.max), ageGroup] as const;
};
