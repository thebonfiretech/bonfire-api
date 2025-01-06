import { UserModelType, UserSpaceType } from "@utils/types/models/user";
import { hasExistsSpace, hasSpace } from "@database/functions/space";
import { hasUser, hasExistsUser } from "@database/functions/user";
import { ManageRequestBody } from "@middlewares/manageRequest";
import stringService from "@utils/services/stringServices";
import { SpaceModelType } from "@utils/types/models/space";
import objectService from "@utils/services/objectServices";
import spaceModel from "@database/model/space";
import userModel from "@database/model/user";

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
                let spaceExists = await hasSpace({ _id: space.name }, manageError);
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

            return {
                user: createdUser
            };
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

            const userExists = await hasUser({ _id: userID }, manageError);
            if (!userExists) return;
            
            await userModel.findByIdAndDelete(userID);

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

            const extra: Partial<SpaceModelType> = {
                lastUpdate: new Date(Date.now()),
                metrics: {
                    users: 1
                }
            };

            const newSpace = new spaceModel({
                ...extra,
                description,
                name,
                owner: {
                    name: owner.name,
                    id: owner._id,
                },
            });

            const userSpace: UserSpaceType = {
                entryAt: new Date(Date.now()),
                id: newSpace._id.toString(),
                role: "owner",
                name
            };

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
};

export default adminResource;