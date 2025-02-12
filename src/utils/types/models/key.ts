import { Types } from "mongoose";

export interface KeyModelType {
    _id: string;
    name: string;
    createAt?: Date;
    key?: string;
    lastUpdate?: Date;
    description?: string;
    keyType: "pix" | "favorite";
    slotType?: "normal" | "special";
    userID: Types.ObjectId;
};