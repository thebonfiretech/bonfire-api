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
};

export default foodResource;