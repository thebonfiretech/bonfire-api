import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';

import userModel from "../../models/user.js";

export default class Service {

    async users(){
        try {
			return await userModel.find().sort({ date: -1 }).select('-password');;
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

    async createSchool({ name, modules }){
        try {

        } catch (err) {
            return { error: "internal_error" } ;
        }
    }

}