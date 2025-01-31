import { ManageRequestBody } from "@middlewares/manageRequest";

const filesResource = {
    uploadFile: async ({ manageError, defaultExpress }: ManageRequestBody) => {
        try {
            const files = defaultExpress.req.files as Express.Multer.File[];


        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
};

export default filesResource;