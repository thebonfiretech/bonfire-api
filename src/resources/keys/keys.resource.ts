import { ManageRequestBody } from "@middlewares/manageRequest";

const keysResource = {
    createKey: async ({ manageError }: ManageRequestBody) => {
        try {
      
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    }
};

export default keysResource;