import { ObjectId } from "mongoose";

export interface OptionFormType {
    id: ObjectId;
    text: string;
}

export interface QuestionFormType {
    type: "text" | "multiple-choice" | "single-choice";
    text: string;
    options: OptionFormType[];
    required: boolean;
}

export interface FormControlModelType {
    name: string;
    user: {
        id: ObjectId;
        avatar?: string;
        name: string;
    };
    status: "active" | "inactive";
    createAt: Date;
    lastUpdate?: Date;
    description?: string;
    images?: {
        banner?: string;
    };
    authenticationRequired: boolean;
    singleShipping: boolean;
    shuffle: boolean;
    collectEmail: boolean;
    questions: QuestionFormType[];
}
