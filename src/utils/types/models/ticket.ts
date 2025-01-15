import { Types } from "mongoose";

export interface TicketMessageType  {
    userID: Types.ObjectId;
    content: string;
    date: Date;
};

export interface TicketModelType {
    _id: string;
    title: string;
    createAt?: Date;
    lastUpdate?: Date;
    description?: string;
    type: "suggestion" | "report" | "feedback" | "other";
    status: "pending" | "answered" | "progress" | "completed";
    scope: "space" | "system";
    userID: Types.ObjectId;
    spaceID?: Types.ObjectId;
    attachments: string[];
    messages: TicketMessageType[];
    displayName: boolean;
};