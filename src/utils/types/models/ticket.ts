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
    userID: Types.ObjectId;
    attachments: string[];
    messages: TicketMessageType[];
};