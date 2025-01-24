import { createTransaction } from "@database/functions/transaction";
import { ManageRequestBody } from "@middlewares/manageRequest";
import transactionModel from "@database/model/transaction";
import userModel from "@database/model/user";
import keyModel from "@database/model/key";
import { hasUser } from "@database/functions/user";
import investmentModel from "@database/model/investment";
import stringService from "@utils/services/stringServices";
import { hasRolePermission, hasSpace } from "@database/functions/space";
import { InvestmentModelType } from "@utils/types/models/investment";
import randomService from "@utils/services/randomService";

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
    getInvestments: async ({ manageError, params }: ManageRequestBody) => {
        try {
            const { spaceID } = params;

            const space = await hasSpace({ _id: spaceID }, manageError);
            if (!space) return;
            
            return await investmentModel.find({ spaceID });
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    createInvestment: async ({ data, manageError, ids, params }: ManageRequestBody) => {
        try {
            const { spaceID } = params;
            const { userID } =  ids;
            if (!userID) return manageError({ code: "invalid_params" });

            const user = await hasUser({ _id: userID }, manageError);
            if (!user) return;

            const space = await hasSpace({ _id: spaceID }, manageError);
            if (!space) return;

            const userSpace = user.spaces?.find(x => x.id == String(spaceID));
            const hasPermisson = await hasRolePermission(userSpace?.role.toString() || "", ["administrator", "manage_coins", "owner"]);
            if (!hasPermisson) return manageError({ code: "no_execution_permission" });

            const spaceInvestmentsCount = await investmentModel.countDocuments({ spaceID });
            const availableSlot = space.modules.economy.systemConfig.investmentsSlots > spaceInvestmentsCount;
            if (!availableSlot) return manageError({ code: "no_slots_available" });

            let { name, description, type, attachments, ...props } = data;
            if (!name || !description || !type) return manageError({ code: "invalid_data" });

            description = stringService.filterBadwords(description);
            name = stringService.filterBadwords(name);

            const newInvestment = new investmentModel({
                createAt: Date.now(),
                ownerID: userID,
                attachments,
                description,
                ...props,
                spaceID,
                name,
                type,
            }); 

            return await newInvestment.save();
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    generateRandomInvestment: async ({ manageError }: ManageRequestBody) => {
        try {
            let investment: any = {};

            investment.yieldFrequency = randomService.chooseRandomItems(["diario", "semanal", "mensal"], 1)[0];
            investment.riskLevel = randomService.chooseRandomItems(["baixo", "moderado", "alto"], 1)[0];
            investment.type = randomService.chooseRandomItems(["CDB", "CDI", "poupanca"], 1)[0];
            investment.minInvestment = randomService.getRandomNumberInRange(1, 25);
            investment.duration = randomService.getRandomNumberInRange(1, 3);
            investment.isRecurring = randomService.getRandomBoolean();
            
            investment.interestRate = 0;
            investment.penaltyRate = 5;
            
            switch (investment.riskLevel) {
                case "baixo":
                    investment.maxInvestment = randomService.getRandomNumberInRange(investment.minInvestment, investment.minInvestment + 15);
                    investment.penaltyRate = randomService.getRandomNumberInRange(1, 3);
                    break;
                case "moderado":
                    investment.maxInvestment = randomService.getRandomNumberInRange(investment.minInvestment, investment.minInvestment + 25 );
                    investment.penaltyRate = randomService.getRandomNumberInRange(4, 7);
                    break;
                case "alto":
                    investment.maxInvestment = randomService.getRandomNumberInRange(investment.minInvestment, investment.minInvestment + 50);
                    investment.penaltyRate = randomService.getRandomNumberInRange(8, 12);
                    break;
            }
            
            switch (investment.type) {
                case "CDB":
                    investment.interestRate = investment.riskLevel === "baixo" ? 3 : investment.riskLevel === "moderado" ? 5 : 7;
                    break;
                case "CDI":
                    investment.interestRate = investment.riskLevel === "baixo" ? 4 : investment.riskLevel === "moderado" ? 6 : 8;
                    break;
                case "poupanca":
                    investment.interestRate = investment.riskLevel === "baixo" ? 2 : investment.riskLevel === "moderado" ? 3 : 4;
                    break;
            }
            
            switch (investment.yieldFrequency) {
                case "diario":
                    investment.interestRate += 0.5;
                    break;
                case "semanal":
                    investment.interestRate += 0.3;
                    break;
                case "mensal":
                    break;
            }
            
            return investment;           
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
};

export default economyResource;