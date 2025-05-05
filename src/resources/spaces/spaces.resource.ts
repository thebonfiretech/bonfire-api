import { UserModelType, UserSpaceType } from "bonfire-shared-types";
import { hasExistsUser, hasUser } from "@database/functions/user";
import { ManageRequestBody } from "@middlewares/manageRequest";
import { hasSpace } from "@database/functions/space";
import stringService from "@utils/services/stringServices";
import spaceModel from "@database/model/space";
import userModel from "@database/model/user";

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
    getFullSpace: async ({ manageError, params, ids }: ManageRequestBody) => {
        try {
            const { spaceID } =  params;
            if (!spaceID) return manageError({ code: "invalid_params" });

            const space = await hasSpace({ _id: spaceID }, manageError);
            if (!space) return;

            const user = await userModel.findById(ids.userID);

            const userSpace = user?.spaces.find(x => x.id == spaceID);

            const role = Array.isArray(space.roles) ? space.roles.find((x: any) => String(x._id) === String(userSpace?.role)) : null;
            if (!role) return manageError({ code: "role_not_found" });

            return {
                space,
                role,
            };
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
    createSpaceRole: async ({ manageError, params, data, ids, manageCheckUserHasPermissions }: ManageRequestBody) => {
        try {
            const { spaceID } =  params;
            if (!spaceID) return manageError({ code: "invalid_params" });

            const space = await hasSpace({ _id: spaceID }, manageError);
            if (!space) return;

            let { name, permissions } = data;
            if (!name || !permissions) return manageError({ code: "invalid_data" });

            const { userID } = ids;

            const user = await hasUser({ _id: userID }, manageError);
            if (!user) return;

            if (!manageCheckUserHasPermissions(user, ["manage_roles"])) return;

            name = stringService.removeSpacesAndLowerCase(name);

            const hasExistentRole = Array.isArray(space.roles) ? space.roles.find((x: any) => x.name === name) : null;
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
    createSpaceUser: async ({ manageError, params, data, ids, manageCheckUserHasPermissions }: ManageRequestBody) => {
        try {
            const { spaceID } =  params;
            if (!spaceID) return manageError({ code: "invalid_params" });

            const space = await hasSpace({ _id: spaceID }, manageError);
            if (!space) return;

            let { id, name, roleID } = data;
            if (!id || !name) return manageError({ code: "invalid_data" });

            const { userID } = ids;

            const user = await hasUser({ _id: userID }, manageError);
            if (!user) return;

            if (!manageCheckUserHasPermissions(user, ["manage_users"])) return;

            id = stringService.removeSpacesAndLowerCase(id);
            name = stringService.normalizeString(name);

            const userExists = await hasExistsUser({ id }, manageError);
            if (!userExists) return;

            const extra: Partial<UserModelType> = {
                lastUpdate: new Date(Date.now()),
            };

            const normalRole = Array.isArray(space.roles) ? space.roles.find((x: any) =>  x.name == "normal") : null;

            let newSpace: UserSpaceType= {
                entryAt: new Date(),
                role: roleID ? roleID : normalRole._id,
                name: space.name,
                id: space._id
            };
        
            extra.spaces = [newSpace];

            let spaceUserMetrics = space.metrics?.users || 0;

            await spaceModel.findByIdAndUpdate(space._id, { $set:{ metrics: { user: spaceUserMetrics + 1 } } }, { new: true });
            
            const createdUser = new userModel({ id, name, ...extra });
            await createdUser.save();

            return createdUser;
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    addSpaceUser: async ({ manageError, params, data, ids, manageCheckUserHasPermissions }: ManageRequestBody) => {
        try {
            const { spaceID } =  params;
            if (!spaceID) return manageError({ code: "invalid_params" });

            const space = await hasSpace({ _id: spaceID }, manageError);
            if (!space) return;

            let { id, roleID } = data;
            if (!id) return manageError({ code: "invalid_data" });

            const { userID } = ids;

            const user = await hasUser({ _id: userID }, manageError);
            if (!user) return;

            if (!manageCheckUserHasPermissions(user, ["manage_users"])) return;

            id = stringService.removeSpacesAndLowerCase(id);

            const invitedUser = await hasUser({ _id: id }, manageError);
            if (!invitedUser) return;

            const hasExistentSpace = invitedUser.spaces?.find((x: any) => String(x.id) == spaceID);
            if (hasExistentSpace) return manageError({ code: "user_already_in_space"});

            const normalRole = Array.isArray(space.roles) ? space.roles.find((x: any) =>  x.name == "normal") : null;

            let newSpace: UserSpaceType= {
                role: roleID ? roleID : normalRole._id,
                entryAt: new Date(),
                name: space.name,
                id: space._id
            };
        
            const spaces  = [...(invitedUser.spaces || []), newSpace];

            let spaceUserMetrics = space.metrics?.users || 0;

            await spaceModel.findByIdAndUpdate(space._id, { $set:{ metrics: { user: spaceUserMetrics + 1 } } }, { new: true });
            
            const updatedUser  = await userModel.findByIdAndUpdate(invitedUser._id, { $set:{ spaces, lastUpdate: Date.now() } }, { new: true }).select("-password");

            return updatedUser;
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    removeSpaceUser: async ({ manageError, params, data, ids, manageCheckUserHasPermissions }: ManageRequestBody) => {
        try {
            const { spaceID } =  params;
            if (!spaceID) return manageError({ code: "invalid_params" });

            const space = await hasSpace({ _id: spaceID }, manageError);
            if (!space) return;

            let { id } = data;
            if (!id) return manageError({ code: "invalid_data" });

            const { userID } = ids;

            const user = await hasUser({ _id: userID }, manageError);
            if (!user) return;

            if (!manageCheckUserHasPermissions(user, ["manage_users"])) return;

            id = stringService.removeSpacesAndLowerCase(id);

            const removeUser = await hasUser({ _id: id }, manageError);
            if (!removeUser) return;

            const hasExistentSpace = removeUser.spaces?.find((x: any) => String(x.id) == spaceID);
            if (!hasExistentSpace) return manageError({ code: "user_not_in_space" });

            const spaces = removeUser.spaces?.filter((x: any) => String(x.id) != spaceID);
        
            let spaceUserMetrics = space.metrics?.users || 0;

            await spaceModel.findByIdAndUpdate(space._id, { $set:{ metrics: { user: spaceUserMetrics - 1 } } }, { new: true });
            
            const removedUser  = await userModel.findByIdAndUpdate(removeUser._id, { $set:{ spaces, lastUpdate: Date.now() } }, { new: true }).select("-password");

            return removedUser;
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    updateSpaceRole: async ({ manageError, params, data, ids, manageCheckUserHasPermissions}: ManageRequestBody) => {
        try {
            const { spaceID, roleID } =  params;
            const { userID } =  ids;
            if (!spaceID || !roleID || !userID) return manageError({ code: "invalid_params" });

            const user = await hasUser({ _id: userID }, manageError);
            if (!user) return;
            
            const space = await hasSpace({ _id: spaceID }, manageError);

            if (!space) return;

            if (!manageCheckUserHasPermissions(user, ["manage_roles"])) return;
 
            const spaceRole = Array.isArray(space.roles) ? space.roles.find((x: any) => String(x._id) === roleID) : null;
            if (!spaceRole) return manageError({ code: "role_not_found" });

            if (spaceRole.system) return manageError({ code: "system_role_modification_forbidden" });

            let { name, permissions } = data;

            if (name) {
                name = stringService.removeSpacesAndLowerCase(name);
    
                if (name !== spaceRole.name) {
                    const hasExistentRole = Array.isArray(space.roles) ? space.roles.find((x: any) => x.name === name) : null;
                    if (hasExistentRole) return manageError({ code: "role_already_exists" });
                };
            };

            if (permissions) spaceRole.permissions = permissions;
            if (name) spaceRole.name = name;

            return await spaceModel.findByIdAndUpdate(spaceID, { $set: { roles: space.roles, lastUpdate: Date.now() } }, { new: true });          
        } catch (error) { 
            manageError({ code: "internal_error", error });
        }
    },
    getSpaceRole: async ({ manageError, params }: ManageRequestBody) => {
        try {
            const { spaceID, roleID } =  params;
            if (!spaceID || !roleID) return manageError({ code: "invalid_params" });

            const space = await hasSpace({ _id: spaceID }, manageError);
            if (!space) return;

            const spaceRole = Array.isArray(space.roles) ? space.roles.find((x: any) => String(x._id) === roleID) : null;
            if (!spaceRole) return manageError({ code: "role_not_found" });

            return spaceRole;
        } catch (error) { 
            manageError({ code: "internal_error", error });
        }
    },
    deleteSpaceRole: async ({ manageError, params, ids, manageCheckUserHasPermissions }: ManageRequestBody) => {
        try {
            const { spaceID, roleID } =  params;
            if (!spaceID || !roleID) return manageError({ code: "invalid_params" });

            const space = await hasSpace({ _id: spaceID }, manageError);
            if (!space) return;

            const { userID } = ids;

            const user = await hasUser({ _id: userID }, manageError);
            if (!user) return;

            if (!manageCheckUserHasPermissions(user, ["manage_roles"])) return;

            const spaceRole = Array.isArray(space.roles) ? space.roles.find((x: any) => String(x._id) === roleID) : null;
            if (!spaceRole) return manageError({ code: "role_not_found" });
            
            const normalRole = Array.isArray(space.roles) ? space.roles.find((x: any) => x.name === "normal") : null;
            if (!normalRole) return manageError({ code: "role_not_found" });

            if (spaceRole.system) return manageError({ code: "system_role_modification_forbidden" });

            const usersWithSpace = await userModel.find({ "spaces.id": spaceID, "spaces.role": roleID });
            for (const spaceUser of usersWithSpace) {
                const userSpace = spaceUser.spaces.find((space) => String(space.id) === spaceID && String(space.role) === roleID);
                if (userSpace) {
                    userSpace.role = normalRole._id; 
                }
                await spaceUser.save();
            }
    
            const newRoles = Array.isArray(space.roles) ? space.roles.filter((x: any) => String(x._id) !== roleID) : null;
            return await spaceModel.findByIdAndUpdate(spaceID, { $set: { roles: newRoles, lastUpdate: Date.now() } }, { new: true });   
        } catch (error) { 
            manageError({ code: "internal_error", error });
        }
    },
    configSpaceModule: async ({ manageError, params, data, ids, manageCheckUserHasPermissions }: ManageRequestBody) => {
        try {
            const { spaceID, module } = params;
            if (!spaceID || !module) return manageError({ code: "invalid_params" });
    
            const space = await spaceModel.findById(spaceID);
            if (!space) return manageError({ code: "space_not_found" });
    
            if (!space.modules || !(module in space.modules)) {
                return manageError({ code: "invalid_params" });
            }
    
            const currentModule = space.modules[module as keyof typeof space.modules] as any;
            if (!currentModule) return manageError({ code: "invalid_params" });

            const { userID } = ids;

            const user = await hasUser({ _id: userID }, manageError);
            if (!user) return;

            if (!manageCheckUserHasPermissions(user, ["manage_modules"])) return;

            const { config } = data;

            currentModule.config = {...currentModule.config, ...config};
    
            currentModule.lastUpdate = new Date();
    
            space.markModified(`modules.${module}`);
            return await space.save();
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    }
};

export default spacesResource;