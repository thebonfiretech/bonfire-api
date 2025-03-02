import { UserModelType, UserSpaceType } from "bonfire-shared-types";
import { hasExistsSpace, hasSpace } from "@database/functions/space";
import { hasUser, hasExistsUser } from "@database/functions/user";
import { ManageRequestBody } from "@middlewares/manageRequest";
import stringService from "@utils/services/stringServices";
import objectService from "@utils/services/objectServices";
import spaceModel from "@database/model/space";
import userModel from "@database/model/user";
import keyModel from "@database/model/key";

const adminResource = {
    createUser: async ({ data, manageError }: ManageRequestBody) => {
        try {
            let { id, name, space } = data;
            if (!id || !name) return manageError({ code: "invalid_data" });

            id = stringService.removeSpacesAndLowerCase(id);
            name = stringService.normalizeString(name);

            const userExists = await hasExistsUser({ id }, manageError);
            if (!userExists) return;

            const extra: Partial<UserModelType> = {
                lastUpdate: new Date(Date.now()),
            };

            if (space) {
                let spaceExists = await hasSpace({ _id: space.id }, manageError);
                if (!spaceExists) return;
            
                let newSpace: UserSpaceType = {
                    entryAt: new Date(),
                    role: space.role,
                    name: space.name,
                    id: space.id
                };
            
                extra.spaces = [newSpace];

                let spaceUserMetrics = spaceExists.metrics?.users || 0;

                await spaceModel.findByIdAndUpdate(space.id, { $set:{ metrics: { user: spaceUserMetrics + 1 } } }, { new: true });
            };
            
            const createdUser = new userModel({ id, name, ...extra });
            await createdUser.save();

            return createdUser;
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    updateUser: async ({ data, manageError, params }: ManageRequestBody) => {
        try {
            const { userID } =  params;
            if (!userID) return manageError({ code: "invalid_params" });

            const userExists = await hasUser({ _id: userID }, manageError);
            if (!userExists) return;

            const filteredUser = objectService.filterObject(data, ["id", "order", "role", "createAt", "password", "_id"]);

            if (filteredUser.name){
                filteredUser.name = stringService.normalizeString(filteredUser.name);
            };

            if (filteredUser.description){
                filteredUser.description = stringService.normalizeString(filteredUser.description);
            };

            return await userModel.findByIdAndUpdate(userID, { $set:{ ...filteredUser, lastUpdate: Date.now() } }, { new: true }).select("-password");
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    deleteUser: async ({ manageError, params }: ManageRequestBody) => {
        try {
            const { userID } =  params;
            if (!userID) return manageError({ code: "invalid_params" });

            const user = await hasUser({ _id: userID }, manageError);
            if (!user) return;
            
            await userModel.findByIdAndDelete(userID);

            const spacesWithUser = user.spaces?.map((x: any) => String(x.id)) || [];
            for (const spaceUser of spacesWithUser) {
                const space = await hasSpace({ _id: spaceUser }, manageError);
                if (space){
                    let spaceUserMetrics = space.metrics?.users || 0;
                    await spaceModel.findByIdAndUpdate(space._id, { $set:{ metrics: { user: spaceUserMetrics - 1 } } }, { new: true });
                };
            };

            const keysWithUser = await keyModel.find({ userID });
            for (const key of keysWithUser) {
                await keyModel.findByIdAndDelete(key._id);

                if (key.keyType == "pix"){
                    const keysAddedInFavorite = await keyModel.find({ keyType: "favorite", key: key.name });
                    for (const keyFavorite of keysAddedInFavorite){
                        await keyModel.findByIdAndDelete(keyFavorite._id);
                    };
                };
            };

            return {
                delete: true
            };
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    getUser: async ({ manageError, params }: ManageRequestBody) => {
        try {
            const { userID } =  params;
            if (!userID) return manageError({ code: "invalid_params" });

           return await hasUser({ _id: userID }, manageError);
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    getAllUsers: async ({ manageError }: ManageRequestBody) => {
        try {
           return await userModel.find().sort({ date: -1 }).select('-password');
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    createSpace: async ({ manageError, data }: ManageRequestBody) => {
        try {
            let { name, description, ownerID } = data;
            if (!name || !ownerID) return manageError({ code: "invalid_data" });

            if (description) description = stringService.filterBadwords(stringService.normalizeString(description));
            name = stringService.normalizeString(name);

            const spaceExists = await hasExistsSpace({ name }, manageError);
            if (!spaceExists) return;

            const owner = await hasUser({ _id: ownerID }, manageError);
            if (!owner) return;
            
            const newSpace = new spaceModel({
                lastUpdate: new Date(Date.now()),
                description,
                name,
                metrics: {
                    users: 1
                },
                roles: [{
                    permissions: ["owner"],
                    system: true,
                    name: "owner"
                }],
                owner: {
                    name: owner.name,
                    id: owner._id,
                },
            });

            const userRoleId = newSpace.roles[0]._id;

            const userSpace: UserSpaceType = {
                entryAt: new Date(Date.now()),
                id: newSpace._id.toString(),
                role: userRoleId.toString(),
                name
            };

            newSpace.roles.push({
                permissions: [],
                name: "normal",
                system: true,
            });

            owner.spaces?.push(userSpace);
            
            await userModel.findByIdAndUpdate(ownerID, { $set:{ ...owner, lastUpdate: Date.now() } });

            return await newSpace.save()
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    getAllSpaces: async ({ manageError }: ManageRequestBody) => {
        try {
            return await spaceModel.find();
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    deleteSpace: async ({ manageError, params }: ManageRequestBody) => {
        try {
            const { spaceID } =  params;
            if (!spaceID) return manageError({ code: "invalid_params" });

            const spaceExists = await hasSpace({ _id: spaceID }, manageError);
            if (!spaceExists) return;
            
            const usersWithSpace = await userModel.find({ "spaces.id": spaceID });
            for (const spaceUser of usersWithSpace) {
                spaceUser.spaces.pull({ id: spaceID });
                await spaceUser.save();
            };

            await spaceModel.findByIdAndDelete(spaceID);

            return {
                delete: true
            };
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    updateSpace: async ({ manageError, params, data }: ManageRequestBody) => {
        try {
            const { spaceID } =  params;
            if (!spaceID) return manageError({ code: "invalid_params" });

            const spaceExists = await hasSpace({ _id: spaceID }, manageError);
            if (!spaceExists) return;

            const filteredSpace = objectService.filterObject(data, ["createAt", "_id", "owner"]);

            if (filteredSpace.name){
                filteredSpace.name = stringService.normalizeString(filteredSpace.name);
    
                const usersWithSpace = await userModel.find({ "spaces.id": spaceID });
                for (const spaceUser of usersWithSpace) {
                    const userSpace = spaceUser.spaces.find(space => String(space.id) === String(spaceID));
                    if (userSpace) {
                        userSpace.name = filteredSpace.name;
                    };
                    await spaceUser.save();
                };
            };

            if (filteredSpace.description){
                filteredSpace.description = stringService.filterBadwords(stringService.normalizeString(filteredSpace.description));
            };

            return await spaceModel.findByIdAndUpdate(spaceID, { $set:{ ...filteredSpace, lastUpdate: Date.now() } }, { new: true });
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    configSpaceModule: async ({ manageError, params, data }: ManageRequestBody) => {
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

            const filteredModule = objectService.getObject(data, ["systemConfig", "config", "status"]);

            if (currentModule.status !== filteredModule?.status) {
                if (filteredModule.status === "active") {
                    if (currentModule.moduleAlreadyUsed == false){
                        const coinsPerUser = (space.metrics?.users || 0) * currentModule.systemConfig.coinPerAddeduser;
                        space.coins = currentModule.systemConfig.initialCoins + coinsPerUser;
                    };

                    currentModule.updateStatusAt = new Date();
                    currentModule.moduleAlreadyUsed = true;
                    
                } else {
                    currentModule.updateStatusAt = new Date();
                }
            };
    
            currentModule.systemConfig = {...currentModule.systemConfig, ...filteredModule.systemConfig};
            currentModule.config = {...currentModule.config, ...filteredModule.config};
            
            if (filteredModule.status) currentModule.status = filteredModule.status;
    
            currentModule.lastUpdate = new Date();
    
            space.markModified(`modules.${module}`);
            return await space.save();
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    }
};

export default adminResource;