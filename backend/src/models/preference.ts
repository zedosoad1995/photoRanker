import { ValidationError } from "@/errors/ValidationError";
import { prisma } from ".";

type MinAgeField = "contentMinAge" | "exposureMinAge";
type MaxAgeField = "contentMaxAge" | "exposureMaxAge";

const checkMinMaxAges = (
  field1: MinAgeField | MaxAgeField,
  value1: number | null | undefined,
  field2: MinAgeField | MaxAgeField,
  value2: number | null | undefined,
) => {
  const isField1Max = field1 === "contentMaxAge" || field1 === "exposureMaxAge" ? true : false;

  if (value1 && value2 && isField1Max && value1 < value2) {
    throw new ValidationError({
      message: `Must be ${
        isField1Max ? "greater" : "less"
      } or equal than the current '${field2}' (${value2})`,
      path: field1,
    });
  }
};

export const PreferenceModel = { ...prisma.preference, checkMinMaxAges };
