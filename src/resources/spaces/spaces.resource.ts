import { hasSpace } from "@database/functions/space";
import spaceModel from "@database/model/space";
import userModel from "@database/model/user";
import { ManageRequestBody } from "@middlewares/manageRequest";

const spacesResource = {
    getSpace: async ({ manageError, params }: ManageRequestBody) => {
        try {
            const { spaceID } =  params;
            if (!spaceID) return manageError({ code: "invalid_params" });

            return await hasSpace({ _id: spaceID }, manageError);
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    getSpaceUsers: async ({ manageError, params }: ManageRequestBody) => {
        try {
            const { spaceID } =  params;
            if (!spaceID) return manageError({ code: "invalid_params" });

            const space = await hasSpace({ _id: spaceID }, manageError);
            if (!space) return;

            return await userModel.find({ "spaces.id": spaceID }).select("-password");
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
};

export default spacesResource;