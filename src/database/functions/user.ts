import { isValidObjectId } from "mongoose";

import userModel, { UserModelType } from "@database/model/user";

export const hasUserAlreadyExists = async (user: Partial<UserModelType>, manageError: Function) => {
    if (user._id && !isValidObjectId(user._id)) return manageError({ code: "user_not_found" }); 
    const hasUser = await userModel.findOne(user).select("-passoword");
    if (hasUser) return manageError({ code: "user_already_exists" });
    return hasUser;
};

export const hasNoUserAlreadyExists = async (user: Partial<UserModelType>, manageError: Function) => {
    if (user._id && !isValidObjectId(user._id)) return manageError({ code: "user_not_found" }); 
    const hasUser = await userModel.findOne(user).select("-passoword");
    if (!hasUser) return manageError({ code: "user_not_found" });
    return hasUser;
};