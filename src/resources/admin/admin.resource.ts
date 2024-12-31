import { ManageRequestBody } from "@middlewares/manageRequest";

const adminResource = {
    createUser: async ({ data, manageError }: ManageRequestBody) => {
        try {
            return data;
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    }
};

export default adminResource;