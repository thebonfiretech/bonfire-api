import { ManageRequestBody } from "@middlewares/manageRequest";
import stringService from "@utils/services/stringServices";
import { KeyModelType } from "@utils/types/models/key";
import { hasUser } from "@database/functions/user";
import keyModel from "@database/model/key";

const keysResource = {
    createKey: async ({ data, manageError, ids }: ManageRequestBody) => {
        try {
            const { userID } =  ids;
            if (!userID) return manageError({ code: "invalid_params" });

            const user = await hasUser({ _id: userID }, manageError);
            if (!user) return;

            let { name, description, keyType, slotType }: Partial<KeyModelType> = data;

            if (keyType == "pix"){
                const isNormalSlot = slotType === "normal";

                const userKeysCount = await keyModel.countDocuments({ userID, slotType });
                
                const availableSlot = (isNormalSlot ? user.keys.slots : user.keys.specialSlots) > userKeysCount;
                if (!availableSlot) return manageError({ code: "no_slots_available" });

                if (!isNormalSlot){
                    if (!name) return manageError({ code: "invalid_data" });
                    name = stringService.normalizeString(name);

                    if (stringService.containsBadwords(name)) return manageError({ code: "content_contains_badwords" });
                } else {
                    name = stringService.normalizeString(user.id);
                };

                if (description) description = stringService.filterBadwords(stringService.normalizeString(description));

                const hasExistentKey = await keyModel.findOne({ name });
                if (hasExistentKey) return manageError({ code: "key_already_exists" });

                const key = new keyModel({
                    lastUpdate: Date.now(),
                    description,
                    slotType,
                    keyType,
                    userID,
                    name
                });

                return await key.save();
            }


        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    }
};

export default keysResource;