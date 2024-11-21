import { IPurchaseType } from "@shared/constants/purchase";
import { ILoggedUserMiddleware } from "../user";

interface IPurchaseMetadata {
  amount: number;
  metadata: {
    type: IPurchaseType;
    [k: string]: any;
  };
}

export interface PurchaseRepo {
  readonly purchaseName: IPurchaseType;
  hasAlreadyBeenPurchased: (user: ILoggedUserMiddleware) => Promise<boolean>;
  getPurchaseAmountAndMetadata: () => IPurchaseMetadata;
  handlePurchase: (userId: string) => Promise<void>;
}
