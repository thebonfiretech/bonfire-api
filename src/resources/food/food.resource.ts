import { ManageRequestBody } from "@middlewares/manageRequest";
import { hasRolePermission } from "@database/functions/space";
import { FoodModelType } from "@utils/types/models/food";
import { hasUser } from "@database/functions/user";
import foodModel from "@database/model/food";

const foodResource = {
    createFood: async ({ data, manageError, ids }: ManageRequestBody) => {
        try {
            const { userID } =  ids;
            if (!userID) return manageError({ code: "invalid_params" });

            const user = await hasUser({ _id: userID }, manageError);
            if (!user) return;

            let { meals, spaceID, date }: Partial<FoodModelType> = data;
            if (!meals || !spaceID || !date) return manageError({ code: "invalid_data" });

            const userSpace = user.spaces?.find(x => x.id == String(spaceID));
            const hasPermisson = await hasRolePermission(userSpace?.role.toString() || "", ["administrator", "manage_food", "owner"]);
            if (!hasPermisson) return manageError({ code: "no_execution_permission" });

            const newFood = new foodModel({
                spaceID,
                userID,
                meals,
                date,
            }); 

            return await newFood.save();
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    getSpaceFoods: async ({ manageError, params }: ManageRequestBody) => {
        try {
            const { spaceID } =  params;
            if (!spaceID) return manageError({ code: "invalid_params" });

            return await foodModel.find({ spaceID });
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    getFood: async ({ manageError, params }: ManageRequestBody) => {
        try {
            const { foodID } =  params;
            if (!foodID) return manageError({ code: "invalid_params" });

            const food = await foodModel.findById(foodID);
            if (!food) return manageError({ code: "food_not_found" });

            return food;
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    deleteFood: async ({ manageError, params, ids}: ManageRequestBody) => {
        try {
            const { foodID } = params;
            const { userID } =  ids;
            if (!userID || !foodID) return manageError({ code: "invalid_params" });

            const user = await hasUser({ _id: userID }, manageError);
            if (!user) return;

            const userSpace = user.spaces?.find(x => x.id == String(foodID));
            const hasPermisson = await hasRolePermission(userSpace?.role.toString() || "", ["administrator", "manage_food", "owner"]);
            if (!hasPermisson) return manageError({ code: "no_execution_permission" });

            await foodModel.findByIdAndDelete(foodID);

            return {
                delete: true
            };
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    updateFood: async ({ manageError, params, ids, data}: ManageRequestBody) => {
        try {
            const { spaceID: foodID } = params;
            const { userID } =  ids;
            if (!userID || !foodID) return manageError({ code: "invalid_params" });

            const user = await hasUser({ _id: userID }, manageError);
            if (!user) return;

            const userSpace = user.spaces?.find(x => x.id == String(foodID));
            const hasPermisson = await hasRolePermission(userSpace?.role.toString() || "", ["administrator", "manage_food", "owner"]);
            if (!hasPermisson) return manageError({ code: "no_execution_permission" });

            let { meals } = data;

            return await foodModel.findByIdAndUpdate(foodID, { $set:{ meals, lastUpdate: Date.now() } }, { new: true });
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
};

export default foodResource;