import { Response } from "express";
import { isValidObjectId } from "mongoose";

import { SpaceModelType } from "@utils/types/models/space";
import { UserModelType } from "@utils/types/models/user";
import spaceModel from "@database/model/space";
import userModel from "@database/model/user";

export const hasExistsSpace = async (space: Partial<SpaceModelType>, manageError: Function): Promise<boolean | undefined> => {
    if (space._id && !isValidObjectId(space._id)){
        return true;
    };
    const hasSpace: SpaceModelType | null = await spaceModel.findOne(space);
    if (hasSpace){
        manageError({ code: "space_already_exists" }); 
        return;
    };
    return true;
};

export const hasSpace = async (space: Partial<SpaceModelType>, manageError: Function): Promise<SpaceModelType | undefined> => {
    if (space._id && !isValidObjectId(space._id)){
        manageError({ code: "invalid_params" }); 
        return;
    };
    const hasSpace: SpaceModelType | null = await spaceModel.findOne(space);
    if (!hasSpace){
        manageError({ code: "space_not_found" }); 
        return;
    };
    return hasSpace;
};

export const hasRolePermission = async (roleID: string, permissions: string[]): Promise<boolean> => {
    const space: SpaceModelType | null = await spaceModel.findOne({ "space.role.id": roleID });
    if (!space) return false;
    
    const role =  Array.isArray(space.roles) ? space.roles.find((x) =>  String(x._id), String(roleID)) : null;

    return permissions.some((permission) => role?.permissions.lenght == 0 ? true :  role.permissions.includes(permission));
};

export const checkUserHasPermissions = async (user: UserModelType | string, manageError: Function, permissions: string[], spaceID: string, res: Response): Promise<boolean> => {
    if (typeof user === "string"){
        if (!user || !isValidObjectId(user)){
            manageError({ code: "no_execution_permission" });
            return false;
        };
        const response = await userModel.findById(user);
        if (!response){
            manageError({ code: "no_execution_permission" });
            return false;       
        }

        user = ((response as any) as UserModelType);
    };
    
    if (user.role === "admin"){
        res.set("checkUserHasPermissions", "admin-user");
        return true
    };

    permissions = ["administrator", "manage_classes", "owner", ...permissions];

    const userSpace = user.spaces?.find(x => x.id == spaceID);
    const roleID = userSpace?.role.toString();

    if (!roleID){
        manageError({ code: "no_execution_permission" });
        return false;
    };

    const space: SpaceModelType | null = await spaceModel.findOne({ "space.role.id": roleID });
    if (!space){
        manageError({ code: "no_execution_permission" });
        return false;
    };
    
    const role =  Array.isArray(space.roles) ? space.roles.find((x) =>  String(x._id), String(roleID)) : null;
    const hasPermisson = permissions.some((permission) => role?.permissions.lenght == 0 ? true :  role.permissions.includes(permission));

    if (!hasPermisson){
        manageError({ code: "no_execution_permission" });
        return false;
    };

    return true;
};