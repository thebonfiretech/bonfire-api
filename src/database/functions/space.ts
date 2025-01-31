import { isValidObjectId } from "mongoose";

import { SpaceModelType, SpaceRoleType } from "@utils/types/models/space";
import spaceModel from "@database/model/space";

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