import { ManageRequestBody } from "@middlewares/manageRequest";
import { FoodModelType } from "bonfire-shared-types";
import { hasUser } from "@database/functions/user";
import foodModel from "@database/model/food";

const foodResource = {
    createFood: async ({ data, manageError, ids, manageCheckUserHasPermissions }: ManageRequestBody) => {
        try {
            const { userID } =  ids;
            if (!userID) return manageError({ code: "invalid_params" });

            const user = await hasUser({ _id: userID }, manageError);
            if (!user) return;

            let { meals, spaceID, date }: Partial<FoodModelType> = data;
            if (!meals || !spaceID || !date) return manageError({ code: "invalid_data" });

            if (!manageCheckUserHasPermissions(user, ["manage_food"])) return;

            const newFood = new foodModel({
                date: new Date(date),
                spaceID,
                userID,
                meals,
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
    deleteFood: async ({ manageError, params, ids, manageCheckUserHasPermissions }: ManageRequestBody) => {
        try {
            const { foodID } = params;
            const { userID } =  ids;
            if (!userID || !foodID) return manageError({ code: "invalid_params" });

            const user = await hasUser({ _id: userID }, manageError);
            if (!user) return;

            if (!manageCheckUserHasPermissions(user, ["manage_food"])) return;

            await foodModel.findByIdAndDelete(foodID);

            return {
                delete: true
            };
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    updateFood: async ({ manageError, params, ids, data, manageCheckUserHasPermissions }: ManageRequestBody) => {
        try {
            const { foodID } = params;
            const { userID } =  ids;
            if (!userID || !foodID) return manageError({ code: "invalid_params" });

            const user = await hasUser({ _id: userID }, manageError);
            if (!user) return;

            if (!manageCheckUserHasPermissions(user, ["manage_food"])) return;

            let { meals } = data;

            return await foodModel.findByIdAndUpdate(foodID, { $set:{ meals, lastUpdate: Date.now() } }, { new: true });
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
};

export default foodResource;