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
            user.coins -= coins;
            await user.save();
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
            return { wallet, user };

        } catch (err) {
            return { error: "internal_error" } ;
        }
    }

    async addWallet({ wallet, coins }, author){
        try {
            if (!wallet || !coins) return { error: "invalid_data" }
            const user = await userModel.findById(author);
            if (!user) return { error: "user_not_found" };
            var wallet = await walletModel.findById(wallet);
            if (!wallet) return { error: "wallet_not_found"};
            if (user.coins < coins) return { error: "insufficient_coins" };
            user.coins -= coins;
            await user.save();
            wallet.transactions.push({ coins });
            wallet.save();

            return { wallet, user };

        } catch (err) {
            return { error: "internal_error" } ;
        }
    }

    async getAllWallet({}, author){
        try {
            return await walletModel.find({author});
        } catch (err) {
            return { error: "internal_error" } ;
        }
    }

    async getWallet({}, user, { wallet }){
        try {
            var wallet = await walletModel.findById(wallet);
            if (!wallet) return { error: "wallet_not_found"};
            return wallet;

        } catch (err) {
            return { error: "internal_error" } ;
        }
    }

}