import { Types } from "mongoose";

export interface FoodMealsType {
    items: string[];
    time: string;
};

export interface FoodModelType {
    spaceID?: Types.ObjectId;
    userID: Types.ObjectId;
    meals: FoodMealsType;
    createAt: Date;
    _id: string;
    date: Date;
};