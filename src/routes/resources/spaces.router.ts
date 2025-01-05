import { Router } from "express";

import spacesResource from "@resources/spaces/spaces.resource";
import manageRequest from "@middlewares/manageRequest";

const spacesRouter = Router();

spacesRouter.get("/:spaceID", manageRequest(spacesResource.getSpace));

export default spacesRouter;