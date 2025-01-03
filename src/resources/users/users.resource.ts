import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { ManageRequestBody } from "@middlewares/manageRequest";
import userModel, { UserModelType } from "@database/model/user";
import { hasUser } from "@database/functions/user";

const usersResource = {
    signUp: async ({ data, manageError }: ManageRequestBody) => {
        try {
            let { id, password } = data;
            if (!id || !password) return manageError({ code: "invalid_data" });

            const findUser = await userModel.findOne({ id });
            if (!findUser) return manageError({ code: "user_not_found" });
            
            if (findUser.status !== "registered") return manageError({ code: "user_already_registered" });

            const salt = await bcrypt.genSalt(10);
            password = await bcrypt.hash(password, salt);

            const extra: Partial<UserModelType> = {
                firstSignup: new Date(Date.now()),
                lastUpdate: new Date(Date.now()),
                status: "loggedIn",
                password
            };

            await userModel.findOneAndUpdate({ id }, { $set:{ ...extra } }, { new: true });

            const token = jwt.sign({ id: findUser._id }, process.env.SECRET || "");
            return { token };		 
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    signIn: async ({ data, manageError }: ManageRequestBody) => {
        try {
            let { id, password } = data;
            if (!id || !password) return manageError({ code: "no_credentials_send" });

            const findUser = await userModel.findOne({ id });
            if (!findUser) return manageError({ code: "user_not_found" });
            
            if (findUser.status !== "loggedIn") return manageError({ code: "user_already_registered" });

            var isPasswordMatch = await bcrypt.compare(password, findUser?.password || "");
            if (!isPasswordMatch) return manageError({ code: "invalid_credentials" });

            const token = jwt.sign({ id: findUser._id }, process.env.SECRET || "");
            return { token };		 
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    getUser: async ({  manageError, ids }: ManageRequestBody) => {
        try {
            return await hasUser({ _id: ids.userID }, manageError);
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
};

export default usersResource;