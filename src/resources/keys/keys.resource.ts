import { ManageRequestBody } from "@middlewares/manageRequest";
import stringService from "@utils/services/stringServices";
import { KeyModelType } from "bonfire-shared-types";
import { hasUser } from "@database/functions/user";
import keyModel from "@database/model/key";

const keysResource = {
    createKey: async ({ data, manageError, ids }: ManageRequestBody) => {
        try {
            const { userID } =  ids;
            if (!userID) return manageError({ code: "invalid_params" });

            const user = await hasUser({ _id: userID }, manageError);
            if (!user) return;

            let { name, description, keyType, slotType, key }: Partial<KeyModelType> = data;

            if (keyType == "pix"){
                const isNormalSlot = slotType === "normal";

                const userKeysCount = await keyModel.countDocuments({ userID, slotType });

                const availableSlot = (isNormalSlot ? user.keys.slots : user.keys.specialSlots) > userKeysCount;
                if (!availableSlot) return manageError({ code: "no_slots_available" });

                if (!isNormalSlot){
                    if (!name) return manageError({ code: "invalid_data" });
                    name = stringService.removeSpacesAndLowerCase(name);

                    if (stringService.containsBadwords(name)) return manageError({ code: "content_contains_badwords" });
                } else {
                    name = stringService.removeSpacesAndLowerCase(user.id);
                };

                if (description) description = stringService.filterBadwords(stringService.normalizeString(description));

                const hasExistentKey = await keyModel.findOne({ name });
                if (hasExistentKey) return manageError({ code: "key_already_exists" });

                const newKey = new keyModel({
                    lastUpdate: Date.now(),
                    description,
                    key: name,
                    slotType,
                    keyType,
                    userID,
                    name,
                });

                return await newKey.save();
            } else {
                const userFavoritesCount = await keyModel.countDocuments({ userID, keyType });

                const availableSlot = user.keys.favoriteSlots > userFavoritesCount;
                if (!availableSlot) return manageError({ code: "no_slots_available" });

                if (!name || !key) return manageError({ code: "invalid_data" });
                name = stringService.normalizeString(name);
                key = stringService.removeSpacesAndLowerCase(key);

                if (description) description = stringService.filterBadwords(stringService.normalizeString(description));

                const hasExistentKey = await keyModel.findOne({ name: key, keyType: "pix" });
                if (!hasExistentKey) return manageError({ code: "key_not_found" });

                const newKey = new keyModel({
                    lastUpdate: Date.now(),
                    description,
                    keyType,
                    userID,
                    name,
                    key
                });

                return await newKey.save();
            };


        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    getKeyInfo: async ({ manageError, params }: ManageRequestBody) => {
        try {
            const { keyID } = params;
            if (!keyID) return manageError({ code: "invalid_params" });

            const key = await keyModel.findOne({ name: keyID });
            if (!key) return manageError({ code: "key_not_found" });

            const user = await hasUser({ _id: key.userID.toString() }, manageError);
            if (!user) return;

            return {
                user: {
                    name: user.name
                },
                key
            };
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    deleteKey: async ({ params, manageError, ids }: ManageRequestBody) => {
        try {
            const { keyID } = params;
            const { userID } =  ids;

            if (!userID) return manageError({ code: "invalid_params" });

            const user = await hasUser({ _id: userID }, manageError);
            if (!user) return;

            const key = await keyModel.findOne({ name: keyID, userID });
            if (!key) return manageError({ code: "key_not_found" });

            await keyModel.findOneAndDelete({ name: keyID });

            const linkedKeys = await keyModel.find({ key: keyID, keyType: "favorite" });
            Promise.all(linkedKeys.map(async (linkedKey) => {
                await keyModel.findByIdAndDelete(linkedKey._id);
            }));

            return {
                delete: true
            };
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    getUserKeys: async ({ manageError, ids }: ManageRequestBody) => {
        try {
            const { userID } =  ids;
            if (!userID) return manageError({ code: "invalid_params" });

            const user = await hasUser({ _id: userID }, manageError);
            if (!user) return;

            const keys = await keyModel.find({ userID });

            return {
                favorite: keys.filter(x => x.keyType == "favorite"),
                pix: keys.filter(x => x.keyType == "pix")
            };
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
};

export default keysResource;