import { ObjectId } from "mongoose";

export type PostScopeType = "all" | "space" | "class" | "role" | "administrators";
export type PostType = "default" | "report" | "warn";

export interface PostModelType {
    space: {
        id: ObjectId;
        name: string;
    };
    class: {
        id: ObjectId;
        name: string;
    };
    creator: {
        id: ObjectId;
        avatar: string;
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
    attachments: string[];
    type: PostType;
    scope: PostScopeType;
};