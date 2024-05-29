import investmentsModel from "../../models/investments.js";
import schoolModel from "../../models/school.js";
import userModel from "../../models/user.js";

export default class Service {

    async getAllUsers(){
        try {
			return await userModel.find().sort({ date: -1 }).select('-password');;
        } catch (err) {
            return { error: "internal_error" } ;
        }
    }
    async getAllSchoolUsers({}, user, {school}){
        try {
			return await userModel.find({school}).sort({ date: -1 }).select('-password');;
        } catch (err) {
            return { error: "internal_error" } ;
        }
    }
    async updateUser({ data, id }){
        try {
			const user = await userModel.findById(id);
			if (!user) return { error: "user_not_found" };
            const newUser = await userModel.findByIdAndUpdate(id, { $set:{ ...data } }, { new: true });
			return newUser;
        } catch (err) {
            return { error: "internal_error" } ;
        }
    }
    async deleteUser({ id }){
        try {
			const user = await userModel.findById(id);
			if (!user) return { error: "user_not_found" };
			await userModel.findByIdAndDelete(id);
			return { success: true };
        } catch (err) {
            return { error: "internal_error" } ;
        }
    }

    async createUserPayload({ name, id, school }){
        try {
            if (!name || !id || !school) return { error: "invalid_data" }
            const findUser = await userModel.findOne({id});
            if (findUser) return { error: "user_already_exists"}
            const findSchool = schoolModel.findById(school);
            if (!findSchool) return { error: "school_not_found"}
            const user = new userModel({ name, id, school });
            await user.save();
            return user;
        } catch (err) {
            return { error: "internal_error" } ;
        }
    }

    async createSchool({ name, modules }){
        try {
            if (!name) return { error: "invalid_data" }
            const school = new schoolModel({ name, modules });
            await school.save();
            return school;
        } catch (err) {
            return { error: "internal_error" } ;
        }
    }

    async deleteSchool({ id }){
        try {
            if (!id) return { error: "invalid_data" }
            const school = schoolModel.findById(id);
            if (!school) return { error: "school_not_found"}
            await schoolModel.findByIdAndDelete(id)
            return { success: true };
        } catch (err) {
            return { error: "internal_error" } ;
        }
    }

    async updateSchool({ data, id }){
        try {
            if (!id) return { error: "invalid_data" }
            const findSchool = schoolModel.findById(id);
            if (!findSchool) return { error: "school_not_found"}
            const school = await schoolModel.findByIdAndUpdate(id, { $set:{ ...data } }, { new: true });
            return school;
        } catch (err) {
            return { error: "internal_error" } ;
        }
    }

    async getSchool({}, user, { id }){
        try {
            if (!id) return { error: "invalid_data" }
            const school = schoolModel.findById(id);
            if (!school) return { error: "school_not_found"}
            return school;
        } catch (err) {
            return { error: "internal_error" } ;
        }
    }
    async getUser({}, user, { id }){
        try {
            if (!id) return { error: "invalid_data" }
            const user = userModel.findById(id);
            if (!user) return { error: "user_not_found"}
            return user;
        } catch (err) {
            return { error: "internal_error" } ;
        }
    }

    async getSchools({}){
        try {
            return await schoolModel.find().sort({ date: -1 });
        } catch (err) {
            return { error: "internal_error" } ;
        }
    }

    async getAllInvestments({}){
        try {
			return await investmentsModel.find({ author }).sort({ date: -1 });
        } catch (err) {
            return { error: "internal_error" } ;
        }
    }

    async createInvestments({ name, description, type, config }, author){
        try {
            if (!name || !type) return { error: "invalid_data" }
            const investments = new investmentsModel({ name, author, description, type, config});
            await investments.save();
            return investments;
        } catch (err) {
            return { error: "internal_error" } ;
        }
    }

}