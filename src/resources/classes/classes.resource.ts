import { hasRolePermission, hasSpace } from "@database/functions/space";
import { UserClassType, UserModelType, UserSpaceType } from "@utils/types/models/user";
import { hasExistsUser, hasUser } from "@database/functions/user";
import { ManageRequestBody } from "@middlewares/manageRequest";
import stringService from "@utils/services/stringServices";
import spaceModel from "@database/model/space";
import userModel from "@database/model/user";
import classModel from "@database/model/class";
import objectService from "@utils/services/objectServices";

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
    },
    getClass: async ({ manageError, params }: ManageRequestBody) => {
        try {
            const { classID } =  params;
            if (!classID) return manageError({ code: "invalid_params" });

            const classe = await classModel.findById(classID);
            if (!classe) return manageError({ code: "class_not_found" });

            return classe;
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    getClassUsers: async ({ manageError, params }: ManageRequestBody) => {
        try {
            const { classID } =  params;
            if (!classID) return manageError({ code: "invalid_params" });

            const classe = await classModel.findById(classID);
            if (!classe) return manageError({ code: "class_not_found" });

            return await userModel.find({ "classes.id": classID }).select("-password");
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    updateClass: async ({ manageError, params, data, ids }: ManageRequestBody) => {
        try {
            const { classID } =  params;
            if (!classID) return manageError({ code: "invalid_params" });

            const classe = await classModel.findById(classID);
            if (!classe) return manageError({ code: "class_not_found" });
            const { userID } = ids;

            const user = await hasUser({ _id: userID }, manageError);
            if (!user) return;

            const userSpace = user.spaces?.find(x => x.id == String(classe?.space?.id || ""));
            const hasPermisson = await hasRolePermission(userSpace?.role.toString() || "", ["administrator", "manage_space", "manage_classes", "owner"]);
            if (!hasPermisson) return manageError({ code: "no_execution_permission" });

            const filteredClass = objectService.filterObject(data, ["createAt", "_id", "space"]);

            if (filteredClass.name){
                filteredClass.name = stringService.normalizeString(filteredClass.name);

                const usersWithClasses = await userModel.find({ "classes.id": classID });
                for (const classUser of usersWithClasses) {
                    const userClass = classUser.classes.find(classe => String(classe.id) === String(classID));
                    if (userClass) {
                        userClass.name = filteredClass.name;
                    };
                    await classUser.save();
                };
            };

            if (filteredClass.description){
                filteredClass.description = stringService.normalizeString(filteredClass.description);
            };

            return await classModel.findByIdAndUpdate(classID, { $set:{ ...filteredClass, lastUpdate: Date.now() } }, { new: true });
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    deleteClass: async ({ manageError, params, data, ids }: ManageRequestBody) => {
        try {
            const { classID } =  params;
            if (!classID) return manageError({ code: "invalid_params" });

            const classe = await classModel.findById(classID);
            if (!classe) return manageError({ code: "class_not_found" });
            const { userID } = ids;

            const user = await hasUser({ _id: userID }, manageError);
            if (!user) return;

            const userSpace = user.spaces?.find(x => x.id == String(classe?.space?.id || ""));
            const hasPermisson = await hasRolePermission(userSpace?.role.toString() || "", ["owner"]);
            if (!hasPermisson) return manageError({ code: "no_execution_permission" });

            const usersWithClasses = await userModel.find({ "classes.id": classID });
            for (const classUser of usersWithClasses) {
                classUser.spaces.pull({ id: classID });
                await classUser.save();
            };
           
            await classModel.findByIdAndDelete(classID);

            return {
                delete: true
            };
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    addClassUser: async ({ manageError, params, data, ids }: ManageRequestBody) => {
        try {
            const { classID } =  params;
            if (!classID) return manageError({ code: "invalid_params" });

            const classe = await classModel.findById(classID);
            if (!classe) return manageError({ code: "class_not_found" });
            const { userID } = ids;

            const user = await hasUser({ _id: userID }, manageError);
            if (!user) return;

            const userSpace = user.spaces?.find(x => x.id == String(classe?.space?.id || ""));
            const hasPermisson = await hasRolePermission(userSpace?.role.toString() || "", ["administrator", "manage_users", "manage_classes", "owner"]);
            if (!hasPermisson) return manageError({ code: "no_execution_permission" });

            let { id } = data;
            if (!id) return manageError({ code: "invalid_data" });

            id = stringService.removeSpacesAndLowerCase(id);

            const invitedUser = await hasUser({ _id: id }, manageError);
            if (!invitedUser) return;

            const hasExistentClass = invitedUser.classes?.find(x => String(x.id) == classID);
            if (hasExistentClass) return manageError({ code: "user_already_in_class"});

            let newClass = {
                entryAt: new Date(),
                name: classe.name,
                id: classe._id
            };
        
            const classes  = [...(invitedUser.classes || []), newClass];

            let classUserMetrics = classe.metrics?.users || 0;

            await classModel.findByIdAndUpdate(classID, { $set:{ metrics: { user: classUserMetrics + 1 } } }, { new: true });
            
            const updatedUser  = await userModel.findByIdAndUpdate(invitedUser._id, { $set:{ classes, lastUpdate: Date.now() } }, { new: true }).select("-password");

            return {
                user: updatedUser
            };
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
};

export default classesResource;