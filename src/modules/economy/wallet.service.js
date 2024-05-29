import investmentsModel from "../../models/investments.js";
import userModel from "../../models/user.js";
import walletModel from "../../models/wallet.js";
import keyModel from "../../models/key.js";

export default class Service {

    async createWallet({ investment, coins }, author){
        try {
            if (!investment || !coins) return { error: "invalid_data" }
            const user = await userModel.findById(author);
            if (!user) return { error: "user_not_found" };
            var investment = await investmentsModel.findById(investment);
            if (!investment) return { error: "investment_not_found" };
            var findWallet = await walletModel.findOne({author, id: investment._id});
            if (findWallet) return { error: "wallet_already_exists" };
            if (user.coins < coins) return { error: "insufficient_coins" };
            const newUser = await userModel.findByIdAndUpdate(author, { $set:{ coins: (user.coins - coins) } }, { new: true });
            const wallet = new walletModel({ 
                id: investment._id,
                author,
                transactions: [
                    {
                        coins
                    }
                ]
            });

            await wallet.save();
            return { wallet, user: newUser };

        } catch (err) {
            return { error: "internal_error" } ;
        }
    }

}