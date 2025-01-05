import { Router } from "express";

import keysResource from "@resources/keys/keys.resource";
import manageRequest from "@middlewares/manageRequest";

const keysRouter = Router();

keysRouter.post("/create", manageRequest(keysResource.createKey));
keysRouter.get("/info/:keyID", manageRequest(keysResource.getKeyInfo));

export default keysRouter;