import { hasRolePermission, hasSpace } from "@database/functions/space";
import { UserClassType, UserModelType, UserSpaceType } from "@utils/types/models/user";
import { hasExistsUser, hasUser } from "@database/functions/user";
import { ManageRequestBody } from "@middlewares/manageRequest";
import stringService from "@utils/services/stringServices";
import spaceModel from "@database/model/space";
import userModel from "@database/model/user";

const classesResource = {
    createClass: async ({ manageError, data, ids }: ManageRequestBody) => {
        try {
            let { name, description, spaceID } = data;
            if (!name || !spaceID) return manageError({ code: "invalid_data" });

            if (description) description = stringService.filterBadwords(stringService.normalizeString(description));
            name = stringService.normalizeString(name);

            const { userID } = ids;

            const user = await hasUser({ _id: userID }, manageError);
            if (!user) return;

            const userSpace = user.spaces?.find(x => x.id == spaceID);
            const hasPermisson = await hasRolePermission(userSpace?.role.toString() || "", ["administrator", "manage_classes", "owner"]);
            if (!hasPermisson) return manageError({ code: "no_execution_permission" });

            const space = await spaceModel.findById(spaceID);
            if (!space) return manageError({ code: "space_not_found" });
            
            const newClass = new spaceModel({
                lastUpdate: new Date(Date.now()),
                description,
                name,
                metrics: {
                    users: 1
                },
                space: {
                    name: space.name,
                    id: space._id,
                },
            });

            const userClass: UserClassType = {
                entryAt: new Date(Date.now()),
                id: newClass._id.toString(),
                name
            };

            user.classes?.push(userClass);
            
            await userModel.findByIdAndUpdate(userID, { $set:{ ...user, lastUpdate: Date.now() } });

            return await newClass.save()
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    } 
};

export default classesResource;