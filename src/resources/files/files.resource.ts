import { ManageRequestBody } from "@middlewares/manageRequest";

const filesResource = {
    uploadFile: async ({ manageError }: ManageRequestBody) => {
        try {

        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
};

export default filesResource;