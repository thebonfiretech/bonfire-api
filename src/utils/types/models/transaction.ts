import { ObjectId } from "mongoose";

export interface TransactionModelType {
  createAt: Date;
  lastUpdate?: Date;
  description?: string;
  type: "buy" | "pix" | "other";
  userID: ObjectId;
  value: number;
  fromID?: ObjectId;
  toID?: ObjectId;
  items: any;
}
