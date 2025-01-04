import { Router } from "express";

import keysResource from "@resources/keys/keys.resource";
import manageRequest from "@middlewares/manageRequest";

const keysRouter = Router();

keysRouter.post("/create", manageRequest(keysResource.createKey));

export default keysRouter;