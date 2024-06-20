import extractModel from "../../models/extract.js";

export default class Service {

    async getAllFavorites({}, author){
        try {
			return await extractModel.find({ author }).sort({ date: -1 });
        } catch (err) {
            return { error: "internal_error" } ;
        }
    }

}