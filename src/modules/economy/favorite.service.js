import favoriteModel from "../../models/favorite.js";
import userModel from "../../models/user.js";

export default class Service {

    async getAllFavorites({}, author){
        try {
			return await favoriteModel.find({ author }).sort({ date: -1 });
        } catch (err) {
            return { error: "internal_error" } ;
        }
    }

    async deleteFavorites({ id }){
        try {
			const favorite = await favoriteModel.findById(id);
			if (!favorite) return { error: "favorite_not_found" };
			await favoriteModel.findByIdAndDelete(id);
			return { success: true };
        } catch (err) {
            return { error: "internal_error" } ;
        }
    }

    async createFavorites({ id, name}, author){
        try {
            if (!id || !name) return { error: "invalid_data" }
            const favorite = new favoriteModel({ id, name, author });
            await favorite.save();
            return favorite;
        } catch (err) {
            return { error: "internal_error" } ;
        }
    }

}