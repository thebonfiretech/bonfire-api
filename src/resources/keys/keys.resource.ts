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

                const userKeysCount = await keyModel.countDocuments({ userID, keyType: slotType });
                if (!(user.keys.slots > userKeysCount)) return manageError({ code: "no_slots_available" });

                if (!isNormalSlot){

                } else {
                    name = stringService.normalizeString(user.id);
                };

                if (description) description = stringService.filterBadwords(stringService.normalizeString(description));

                const key = new keyModel({
                    lastUpdate: Date.now(),
                    description,
                    slotType,
                    keyType,
                    userID
                });

                return await key.save();
            }


        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    }
};

export default keysResource;