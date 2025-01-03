import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { ManageRequestBody } from "@middlewares/manageRequest";
import userModel, { UserModelType } from "@database/model/user";

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
                lastUpdate: new Date(Date.now()),
                status: "loggedIn",
                password
            };

            await userModel.findOneAndUpdate({ id }, { $set:{ ...extra } }, { new: true });
            
            const token = jwt.sign({ id }, process.env.SECRET || "");
            return { token };		 
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    }
};

export default usersResource;