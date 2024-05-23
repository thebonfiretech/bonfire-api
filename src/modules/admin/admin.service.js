import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';

import schoolModel from "../../models/school.js";
import userModel from "../../models/user.js";
import school from "../../models/school.js";
import { success } from "gulog";

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

    async createUserPayload({ id, school }){
        try {
            if (!name) return { error: "invalid_data" }
            const school = new schoolModel({ name, modules });
            await school.save();
            return school;
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

    async getSchool(body, user, { id }){
        try {
            if (!id) return { error: "invalid_data" }
            const school = schoolModel.findById(id);
            if (!school) return { error: "school_not_found"}
            return school;
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

}