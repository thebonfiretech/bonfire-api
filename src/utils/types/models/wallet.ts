import { Types } from "mongoose";

export interface YieldingType {
    value: number;
    addeAt?: Date;
};

export interface LogType {
    description: string;
    date: Date;
};

export interface WalletModelType {
    name?: string;
    createdAt?: Date;
    lastUpdate?: Date;
    userID: Types.ObjectId;
    spaceID: Types.ObjectId;
    investmentID: Types.ObjectId;
    availableValue: number;
    yielding: YieldingType[];
    logs: LogType[];
    _id: string;
};