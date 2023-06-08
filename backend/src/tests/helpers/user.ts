import { faker } from "@faker-js/faker";
import { formatDate } from "@/helpers/date";
import { ETHNICITY } from "@/constants/user";
import { COUNTRIES } from "@/constants/user";

export const randomizeUser = () => ({
  email: faker.internet.email(),
  name: faker.person.fullName(),
  dateOfBirth: formatDate(
    faker.date.birthdate({
      min: 18,
      max: 100,
      mode: "age",
    })
  ),
  ethnicity: faker.helpers.arrayElement(ETHNICITY),
  countryOfOrigin: faker.helpers.arrayElement(COUNTRIES),
  password: faker.internet.password(),
});
