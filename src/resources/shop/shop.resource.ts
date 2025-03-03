import { ManageRequestBody } from "@middlewares/manageRequest";
import stringService from "@utils/services/stringServices";
import objectService from "@utils/services/objectServices";
import { hasUser } from "@database/functions/user";
import productModel from "@database/model/product";
import categoryModel from "@database/model/category";
import spaceModel from "@database/model/space";
import userModel from "@database/model/user";

const shopResource = {
    createProduct: async ({ manageError, data, ids }: ManageRequestBody) => {
        try {
            let { name, description, value, spaceID, categoryID, metrics, attachments } = data;
            if (!name || !spaceID || !categoryID) return manageError({ code: "invalid_data" });

            name = stringService.filterBadwords(stringService.normalizeString(name));
            if (description) description = stringService.filterBadwords(stringService.normalizeString(description));

            const { userID } = ids;
            const user = await hasUser({ _id: userID }, manageError);
            if (!user) return;

            const category = await categoryModel.findById(categoryID);
            if (!category) return manageError({ code: "category_not_found" });

            const newProduct = new productModel({
                attachments,
                description,
                metrics,
                spaceID,
                userID,
                value,
                name,
            });

            return await newProduct.save();
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },

    getProduct: async ({ manageError, params }: ManageRequestBody) => {
        try {
            const { productID } = params;
            if (!productID) return manageError({ code: "invalid_params" });

            const product = await productModel.findById(productID);
            if (!product) return manageError({ code: "product_not_found" });

            return product;
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },

    getSpaceProducts: async ({ manageError, params }: ManageRequestBody) => {
        try {
            const { spaceID } = params;
            if (!spaceID) return manageError({ code: "invalid_params" });

            return await productModel.find({ spaceID });
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },

    getSpaceCategoryProducts: async ({ manageError, params }: ManageRequestBody) => {
        try {
            const { spaceID, categoryID } = params;
            if (!spaceID || !categoryID) return manageError({ code: "invalid_params" });

            return await productModel.find({ spaceID, categoryID });
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },

    getRandomProduct: async ({ manageError, params }: ManageRequestBody) => {
        try {
            const { categoryID } = params;
            const query = categoryID ? { categoryID } : {};
            const count = await productModel.countDocuments(query);
            if (count === 0) return manageError({ code: "no_products_available" });

            const random = Math.floor(Math.random() * count);
            const product = await productModel.findOne(query).skip(random);
            return product;
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },

    updateProduct: async ({ manageError, params, data, ids }: ManageRequestBody) => {
        try {
            const { productID } = params;
            if (!productID) return manageError({ code: "invalid_params" });

            const product = await productModel.findById(productID);
            if (!product) return manageError({ code: "product_not_found" });

            const { userID } = ids;
            if (String(product.userID) !== String(userID)) return manageError({ code: "no_execution_permission" });

            const filteredData = objectService.filterObject(data, ["_id", "userID", "createdAt", "spaceID"]);
            if (filteredData.name) filteredData.name = stringService.filterBadwords(stringService.normalizeString(filteredData.name));
            if (filteredData.description) filteredData.description = stringService.filterBadwords(stringService.normalizeString(filteredData.description));
            
            return await productModel.findByIdAndUpdate(productID, { $set: { ...filteredData, lastUpdate: Date.now() } }, { new: true });
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    buyProduct: async ({ manageError, params, ids }: ManageRequestBody) => {
        try {
            const { productID } = params;
            if (!productID) return manageError({ code: "invalid_params" });

            const product = await productModel.findById(productID);
            if (!product) return manageError({ code: "product_not_found" });

            if (!product.metrics) product.metrics = { sold: 0, available: 0, views: 0 };

            const { userID } = ids;
            const user = await userModel.findById(userID);
            if (!user) return manageError({ code: "user_not_found" });

            if ((user.coins || 0) < product.value) return manageError({ code: "insufficient_coins" });

            user.coins -= product.value;
            await user.save();

            const { spaceID } = product;
            const space = await spaceModel.findById(spaceID);
            if (!space) return manageError({ code: "space_not_found" });

            space.coins = (space.coins || 0) + product.value;
            await space.save();

            product.metrics.sold += 1;
            product.metrics.available = Math.max(0, product.metrics.available - 1);
            await product.save();

            return { success: true, product };
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    }
};

export default shopResource;
