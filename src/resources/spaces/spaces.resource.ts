import { ManageRequestBody } from "@middlewares/manageRequest";

const spacesResource = {
    getSpace: async ({ manageError }: ManageRequestBody) => {
        try {

        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
};

export default spacesResource;