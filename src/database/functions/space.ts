import spaceModel, { SpaceModelType } from "@database/model/space";

export const hasSpaceAlreadyExists = async (space: Partial<SpaceModelType>, manageError: Function) => {
    const hasSpace = await spaceModel.findOne(space);
    if (hasSpace) return manageError({ code: "space_already_exists" });
};

export const hasNoSpaceAlreadyExists = async (space: Partial<SpaceModelType>, manageError: Function) => {
    const hasSpace = await spaceModel.findOne(space);
    if (!hasSpace) return manageError({ code: "space_not_found" });
};