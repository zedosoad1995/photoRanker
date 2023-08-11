import { ORDER_BY_DIR } from "@/constants/query";

export const parseOrderBy = ({
  orderBy,
  orderByDir = ORDER_BY_DIR.ASC,
}: {
  orderBy?: string;
  orderByDir?: string;
}) => {
  if (!orderBy) return {};

  return { [orderBy]: orderByDir };
};
