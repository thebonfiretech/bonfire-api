import { isValidObjectId } from "mongoose";

import { SpaceModelType } from "@utils/types/models/space";
import spaceModel from "@database/model/space";

export const hasExistsSpace = async (space: Partial<SpaceModelType>, manageError: Function): Promise<boolean | undefined> => {
    if (space._id && !isValidObjectId(space._id)){
        console.log("aqui")
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