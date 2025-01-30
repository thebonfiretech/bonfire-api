import { ManageRequestBody } from "@middlewares/manageRequest";
import { hasRolePermission } from "@database/functions/space";
import stringService from "@utils/services/stringServices";
import objectService from "@utils/services/objectServices";
import categoryModel from "@database/model/category";
import { hasUser } from "@database/functions/user";

const categoryResource = {
    createCategory: async ({ manageError, data, ids }: ManageRequestBody) => {
        try {
            let { name, description, scope } = data;
            if (!name || !scope) return manageError({ code: "invalid_data" });

            name = stringService.filterBadwords(stringService.normalizeString(name));
            if (description) description = stringService.filterBadwords(stringService.normalizeString(description));

            const { userID } = ids;
            const user = await hasUser({ _id: userID }, manageError);
            if (!user) return;

            const userSpace = user.spaces?.find(x => x.id == String(scope || ""));
            const hasPermisson = await hasRolePermission(userSpace?.role.toString() || "", ["administrator", "manage_categorys", "owner"]);
            if (!hasPermisson) return manageError({ code: "no_execution_permission" });

            const newCategory = new categoryModel({
                name,
                description,
                scope,
                userID,
                createdAt: new Date(),
                lastUpdate: new Date(),
            });

            return await newCategory.save();
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    
    getCategory: async ({ manageError, params }: ManageRequestBody) => {
        try {
            const { categoryID } = params;
            if (!categoryID) return manageError({ code: "invalid_params" });

            const category = await categoryModel.findById(categoryID);
            if (!category) return manageError({ code: "category_not_found" });

            return category;
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    
    getCategories: async ({ manageError, params }: ManageRequestBody) => {
        try {
            const { scope, id } = params;
            if (!scope || !id) return manageError({ code: "invalid_params" });

            return await categoryModel.find({ scope, userID: id });
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    
    updateCategory: async ({ manageError, params, data, ids }: ManageRequestBody) => {
        try {
            const { categoryID } = params;
            if (!categoryID) return manageError({ code: "invalid_params" });

            const category = await categoryModel.findById(categoryID);
            if (!category) return manageError({ code: "category_not_found" });

            const { userID } = ids;
            const user = await hasUser({ _id: userID }, manageError);
            if (!user) return;

            const userSpace = user.spaces?.find(x => x.id == String(category.scope || ""));
            const hasPermisson = await hasRolePermission(userSpace?.role.toString() || "", ["administrator", "manage_categorys", "owner"]);
            if (!hasPermisson) return manageError({ code: "no_execution_permission" });

            const filteredData = objectService.filterObject(data, ["_id", "userID", "createdAt"]);
            if (filteredData.name) filteredData.name = stringService.filterBadwords(stringService.normalizeString(filteredData.name));
            if (filteredData.description) filteredData.description = stringService.filterBadwords(stringService.normalizeString(filteredData.description));
            
            return await categoryModel.findByIdAndUpdate(categoryID, { $set: { ...filteredData, lastUpdate: Date.now() } }, { new: true });
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    
    deleteCategory: async ({ manageError, params, ids }: ManageRequestBody) => {
        try {
            const { categoryID } = params;
            if (!categoryID) return manageError({ code: "invalid_params" });

            const category = await categoryModel.findById(categoryID);
            if (!category) return manageError({ code: "category_not_found" });

            const { userID } = ids;
            const user = await hasUser({ _id: userID }, manageError);
            if (!user) return;

            const userSpace = user.spaces?.find(x => x.id == String(category.scope || ""));
            const hasPermisson = await hasRolePermission(userSpace?.role.toString() || "", ["administrator", "manage_categorys", "owner"]);
            if (!hasPermisson) return manageError({ code: "no_execution_permission" });
            
            await categoryModel.findByIdAndDelete(categoryID);
            return { delete: true };
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
};

export default categoryResource;