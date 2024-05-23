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
    async update({ data, id }){
        try {
					const user = await userModel.findById(id);
					if (!user) return { error: "user_not_found" };
					const newUser = await userModel.findByIdAndUpdate(id, { $set:{ ...data } }, { new: true });
					return newUser;
        } catch (err) {
            return { error: "internal_error" } ;
        }
    }
    async delete({ id }){
        try {
					const user = await userModel.findById(id);
					if (!user) return { error: "user_not_found" };
					const newUser = await userModel.findByIdAndDelete(id);
					return { success: true };
        } catch (err) {
            return { error: "internal_error" } ;
        }
    }
    
}