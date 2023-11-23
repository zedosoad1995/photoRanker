import { IPurchaseType } from "@shared/constants/purchase";
import { ILoggedUserMiddleware } from "../user";

interface IPurchaseMetadata {
  amount: number;
  metadata: {
    type: IPurchaseType;
    [k: string]: any;
  };
}

export interface PurchaseRepo<T = any> {
  readonly purchaseName: IPurchaseType;
  hasAlreadyBeenPurchased: (user: ILoggedUserMiddleware, props: T) => Promise<boolean>;
  getPurchaseAmountAndMetadata: (props: T) => IPurchaseMetadata | null;
  handlePurchase: (userId: string, props: T) => Promise<void>;
}
