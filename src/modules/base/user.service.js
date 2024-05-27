import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';

import userModel from "../../models/user.js";

export default class Service {

    async signIn({id, password }){
        try {
            if (!id || !password) return { error: "no_credentials" };
            const user = await userModel.findOne({ id });
            if (!user) return { error: "user_not_found" };
            var isPasswordMatch = await bcrypt.compare(password, user.password);
            if (!isPasswordMatch) return { error: "invalid_credentials"};
            const token = jwt.sign({ id: user._id, school: user.school }, process.env.JWT);
            return { token };
        } catch (err) {
            return { error: "internal_error" } ;
        }
    }
	
    async signUp({id, password}){
        try {
            if (!id || !password) return { error: "no_credentials" };
            const hasUser = await userModel.findOne({ id });
            if (!hasUser) return { error: "user_not_found" };
            if (hasUser.status != "never-logged-in") return { error: "user_already_exists" };
            var salt = await bcrypt.genSalt(10);
            password = await bcrypt.hash(password, salt);
            const user = await userModel.findByIdAndUpdate(hasUser._id, { $set:{ status: "logged", loginDay: Date.now(), password} }, { new: true });
            const token = jwt.sign({ id: user._id, school: user.school }, process.env.JWT);
            return { token };		 
        } catch (err) {
            return { error: "internal_error" } ;
        }
    }
	
    async me({}, id){
        try {
            const user = await userModel.findById(id).select('-password');
            if (!user) return { error: "user_not_found" };
            return user;	
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
    
}