import { ORDER_BY_DIR, ORDER_BY_DIR_OPTIONS_TYPE } from "@/constants/query";

export const parseOrderBy = ({
  orderBy,
  orderByDir = ORDER_BY_DIR.ASC,
}: {
  orderBy?: string;
  orderByDir?: ORDER_BY_DIR_OPTIONS_TYPE;
}) => {
  if (!orderBy) return {};

  return { [orderBy]: orderByDir };
};

export const parseBoolean = (value: string | undefined) => {
  if (value === "true") {
    return true;
  } else if (value === "false") {
    return false;
  }
};
