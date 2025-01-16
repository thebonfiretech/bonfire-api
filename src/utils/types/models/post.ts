import { ObjectId } from "mongoose";

export interface PostModelType {
    space: {
        id: ObjectId;
        name: string;
    };
    class: {
        id: ObjectId;
        name: string;
    };
    role: {
        id: ObjectId;
        name: string;
    };
    createAt: Date;
    lastUpdate?: Date;
    content?: string;
    title?: string;
    images?: {
        profile?: string;
    };
    type: "default" | "report" | "warn";
    scope: "all" | "space" | "class" | "role" | "administrators";
};