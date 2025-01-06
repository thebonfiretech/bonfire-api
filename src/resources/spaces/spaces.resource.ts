import { hasSpace } from "@database/functions/space";
import spaceModel from "@database/model/space";
import userModel from "@database/model/user";
import { ManageRequestBody } from "@middlewares/manageRequest";
import stringService from "@utils/services/stringServices";

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
    getSpaceRoles: async ({ manageError, params }: ManageRequestBody) => {
        try {
            const { spaceID } =  params;
            if (!spaceID) return manageError({ code: "invalid_params" });

            const space = await hasSpace({ _id: spaceID }, manageError);
            if (!space) return;

            return space.roles || [];
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
    createSpaceRole: async ({ manageError, params, data }: ManageRequestBody) => {
        try {
            const { spaceID } =  params;
            if (!spaceID) return manageError({ code: "invalid_params" });

            const space = await hasSpace({ _id: spaceID }, manageError);
            if (!space) return;

            let { name, permissions } = data;
            if (!name || !permissions) return manageError({ code: "invalid_data" });

            name = stringService.removeSpacesAndLowerCase(name);

            const hasExistentRole = Array.isArray(space.roles) ? space.roles.find((x) => x.name === name) : null;
            if (hasExistentRole) return manageError({ code: "role_already_exists" });

            const newRole = {
                permissions,
                name
            };

            if (Array.isArray(space.roles)){
                space.roles.push(newRole);    
            };

            return await spaceModel.findByIdAndUpdate(spaceID, { $set:{ ...space, lastUpdate: Date.now() } }, { new: true });          
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
};

export default spacesResource;