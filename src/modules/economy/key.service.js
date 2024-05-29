import userModel from "../../models/user.js";
import keyModel from "../../models/key.js";

export default class Service {

    async getAllKeys({}, author){
        try {
			return await keyModel.find({ author }).sort({ date: -1 });
        } catch (err) {
            return { error: "internal_error" } ;
        }
    }

    async getKeyData({}, user, { key }){
        try {
			const findKey = await keyModel.findOne({ id: key });
			if (!findKey) return { error: "key_not_found" };
            const user = await userModel.findById(findKey.author).select("-password");
            if (!user) return { error: "user_not_found" };
            return { key: findKey, user }

        } catch (err) {
            return { error: "internal_error" } ;
        }
    }

    async deleteKey({ id }){
        try {
			const key = await keyModel.findById(id);
			if (!key) return { error: "key_not_found" };
			await keyModel.findByIdAndDelete(id);
			return { success: true };
        } catch (err) {
            return { error: "internal_error" } ;
        }
    }

    async createKey({ id }, author){
        try {
            if (!id) return { error: "invalid_data" }
            const findKey = await keyModel.findOne({id});
            if (findKey) return { error: "key_already_exists"}
            const key = new keyModel({ id, author });
            await key.save();
            return key;
        } catch (err) {
            return { error: "internal_error" } ;
        }
    }

}