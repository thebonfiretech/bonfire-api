import { ManageRequestBody } from "@middlewares/manageRequest";
import userModel from "@database/model/user";

const adminResource = {
    createUser: async ({ data, manageError }: ManageRequestBody) => {
        try {
            const { id, name, space } = data;
            if (!id || !name) return manageError({ code: "invalid_data" });

            const hasUser = await userModel.findOne({ id });
            if (hasUser) return manageError({ code: "user_already_exists" });


        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    }
};

export default adminResource;