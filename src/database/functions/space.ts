import { isValidObjectId } from "mongoose";

import spaceModel, { SpaceModelType } from "@database/model/space";

export const hasSpaceAlreadyExists = async (space: Partial<SpaceModelType>, manageError: Function) => {
    if (space._id && !isValidObjectId(space._id)) return manageError({ code: "space_not_found" }); 
    const hasSpace = await spaceModel.findOne(space);
    if (hasSpace) return manageError({ code: "space_already_exists" });
    return hasSpace;
};

export const hasNoSpaceAlreadyExists = async (space: Partial<SpaceModelType>, manageError: Function) => {
    if (space._id && !isValidObjectId(space._id)) return manageError({ code: "space_not_found" }); 
    const hasSpace = await spaceModel.findOne(space);
    if (!hasSpace) return manageError({ code: "space_not_found" });
    return hasSpace;
};