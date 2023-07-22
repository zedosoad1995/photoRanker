export const AGE_OPTIONS = [
  ...Array.from({ length: 100 - 18 }, (_, index) => (index + 18).toString()),
  "100+",
];

export enum SEXES {
  MALE = "Male",
  FEMALE = "Female",
}
