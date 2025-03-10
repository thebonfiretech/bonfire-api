import { ManageRequestBody } from "@middlewares/manageRequest";
import stringService from "@utils/services/stringServices";
import fileModel from "@database/model/file";
import storage from "@database/storage";

const filesResource = {
    uploadFile: async ({ manageError, files, ids, params }: ManageRequestBody) => {
        try {
            if (!files || files.length === 0) return manageError({ code: "invalid_data" });
            
            const { userID } = ids;
            const { scope = "general", id } = params;
            const uploadedFiles = [];
            const errorFiles = [];

            for (const file of files) {
                const { originalname, mimetype, buffer } = file;

                if (!originalname || !mimetype) {
                    errorFiles.push(file);
                    continue;
                }

                const newFile = new fileModel({
                    name: stringService.normalizeString(originalname),
                    status: "inactive",
                    scope,
                    userID,
                    id,
                });

                await newFile.save();

                const filePath = `${scope}`;
                await storage.uploadFile(newFile._id.toString(), buffer, mimetype, filePath);

                newFile.url = `${process.env.STORAGE_URL}${process.env.STORAGE_BUCKET_NAME}/${filePath}/${newFile._id.toString()}`;

                await newFile.save();

                uploadedFiles.push(newFile);
            }

            return {
                uploaded: uploadedFiles,
                errors: errorFiles,
            };
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
};

export default filesResource;
