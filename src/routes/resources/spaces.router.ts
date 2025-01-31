import { Router } from "express";

import spacesResource from "@resources/spaces/spaces.resource";
import manageRequest from "@middlewares/manageRequest";

const spacesRouter = Router();

spacesRouter.delete("/:spaceID/roles/delete/:roleID", manageRequest(spacesResource.deleteSpaceRole));
spacesRouter.patch("/:spaceID/roles/update/:roleID", manageRequest(spacesResource.updateSpaceRole));
spacesRouter.post("/:spaceID/roles/create", manageRequest(spacesResource.createSpaceRole));
spacesRouter.get("/:spaceID/roles/:roleID", manageRequest(spacesResource.getSpaceRole));
spacesRouter.get("/:spaceID/roles", manageRequest(spacesResource.getSpaceRoles));

spacesRouter.patch("/:spaceID/modules/config/:module", manageRequest(spacesResource.configSpaceModule));

spacesRouter.post("/:spaceID/users/create", manageRequest(spacesResource.createSpaceUser));
spacesRouter.post("/:spaceID/users/remove", manageRequest(spacesResource.removeSpaceUser));
spacesRouter.post("/:spaceID/users/add", manageRequest(spacesResource.addSpaceUser));
spacesRouter.get("/:spaceID/users", manageRequest(spacesResource.getSpaceUsers));

spacesRouter.get("/:spaceID", manageRequest(spacesResource.getSpace));

export default spacesRouter;