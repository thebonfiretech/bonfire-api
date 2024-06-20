import extractModel from "../../models/extract.js";
import userModel from "../../models/user.js";

export default class Service {

    async createTransaction({ from, to, coins }){
        try {
            if (!from || !to || !coins) return { error: "invalid_data" }
            var fromUser = await userModel.findById(from).select("-password");
            if (!fromUser) return { error: "user_not_found" };
            if (fromUser.coins < coins) return { error: "insufficient_coins" };
            var toUser = await userModel.findById(to).select("-password");
            if (!toUser) return { error: "user_not_found" };
            fromUser.coins -= Number(coins);
            await fromUser.save(); 
            toUser.coins += Number(coins);
            await toUser.save(); 
            const fromExtract = await extractModel.create({
                author: from,
                value: -coins,
                description: `Transferência para ${toUser.name}`,
                type: 'transaction'
            }); 
            const toExtract = await extractModel.create({
                author: to,
                value: coins,
                description: `Recebido de  ${fromUser.name}`,
                type: 'transaction'
            });
            return { from: fromUser, to: toUser, fromExtract, toExtract }

        } catch (err) {
            console.log(err)
            return { error: "internal_error" } ;
        }
    }

}