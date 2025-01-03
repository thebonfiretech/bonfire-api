import userModel, { UserModelType } from "@database/model/user";

export const hasUserAlreadyExists = async (user: Partial<UserModelType>, manageError: Function) => {
    const hasUser = await userModel.findOne(user);
    if (hasUser) return manageError({ code: "user_already_exists" });
};

export const hasNoUserAlreadyExists = async (user: Partial<UserModelType>, manageError: Function) => {
    const hasUser = await userModel.findOne(user);
    if (!hasUser) return manageError({ code: "user_not_found" });
};