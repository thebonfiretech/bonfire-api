import { createTransaction } from "@database/functions/transaction";
import { ManageRequestBody } from "@middlewares/manageRequest";
import transactionModel from "@database/model/transaction";
import userModel from "@database/model/user";
import keyModel from "@database/model/key";

const economyResource = {
    sendPix: async ({ manageError, ids, params, data }: ManageRequestBody) => {
        try {
            const { keyID } = params;
            const { userID } =  ids;
            const { value } = data;

            if (!userID || !value) return manageError({ code: "invalid_params" });

            const user = await userModel.findById(userID).select("-password");
            if (!user) return manageError({ code: "user_not_found" }); 
            
            const key = await keyModel.findOne({ name: keyID });
            if (!key) return manageError({ code: "key_not_found" });
            
            const receiver = await userModel.findById(key.userID.toString()).select("-password");
            if (!receiver) return manageError({ code: "user_not_found" }); 

            if ((user.coins || 0) < value) return manageError({ code: "insufficient_coins" });

            user.coins -= value;
            await user.save();

            receiver.coins += value;
            await receiver.save();

            await createTransaction({
                fromID: key.userID as any,
                userID: user._id as any,
                value: -value,
                type: "pix",
            });

            await createTransaction({
                userID: key.userID as any,
                toID: userID as any,
                value: value,
                type: "pix",
            });

            return {
                receiver,
                user
            };  
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    getTransactions: async ({ manageError, ids }: ManageRequestBody) => {
        try {
            const { userID } =  ids;

            if (!userID) return manageError({ code: "invalid_params" });

            const user = await userModel.findById(userID).select("-password");
            if (!user) return manageError({ code: "user_not_found" }); 
            
            return await transactionModel.find({ userID });
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
};

export default economyResource;