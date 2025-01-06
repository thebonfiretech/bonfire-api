import { Router } from "express";

import spacesResource from "@resources/spaces/spaces.resource";
import manageRequest from "@middlewares/manageRequest";

const spacesRouter = Router();

spacesRouter.delete("/:spaceID/roles/delete/:roleID", manageRequest(spacesResource.deleteSpaceRole));
spacesRouter.patch("/:spaceID/roles/update/:roleID", manageRequest(spacesResource.updateSpaceRole));
spacesRouter.post("/:spaceID/roles/create", manageRequest(spacesResource.createSpaceRole));
spacesRouter.get("/:spaceID/users", manageRequest(spacesResource.getSpaceUsers));
spacesRouter.get("/:spaceID/roles", manageRequest(spacesResource.getSpaceRoles));
spacesRouter.get("/:spaceID", manageRequest(spacesResource.getSpace));

export default spacesRouter;