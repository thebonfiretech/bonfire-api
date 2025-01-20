import { ManageRequestBody } from "@middlewares/manageRequest";
import stringService from "@utils/services/stringServices";
import { KeyModelType } from "@utils/types/models/key";
import { hasUser } from "@database/functions/user";
import keyModel from "@database/model/key";

const economyResource = {
    createKey: async ({ data, manageError, ids }: ManageRequestBody) => {
        try {
  

        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
};

export default economyResource;