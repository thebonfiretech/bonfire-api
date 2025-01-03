import userModel, { UserSpaceType } from "@database/model/user";
import { hasNoUserAlreadyExists, hasUserAlreadyExists } from "@database/functions/user";
import { ManageRequestBody } from "@middlewares/manageRequest";
import spaceModel from "@database/model/space";

const adminResource = {
    createUser: async ({ data, manageError }: ManageRequestBody) => {
        try {
            const { id, name, space } = data;
            if (!id || !name) return manageError({ code: "invalid_data" });

            await hasUserAlreadyExists({ id }, manageError);

            const userModelCount = await userModel.countDocuments();

            const extra: any = {
                lastUpdate: new Date(Date.now()),
                order: userModelCount + 1
            };

            if (space) {
                let hasSpace = await spaceModel.findById(space.id);
                if (!hasSpace) return manageError({ code: "space_not_found" });
            
                let newSpace: UserSpaceType = {
                    entryAt: new Date(),
                    role: space.role,
                    name: space.name,
                    id: space.id
                };
            
                extra.spaces = [newSpace];

                let spaceUserMetrics = hasSpace.metrics?.users || 0;

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

            await hasNoUserAlreadyExists({ _id: userID }, manageError);

  
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
    }
};

export default adminResource;