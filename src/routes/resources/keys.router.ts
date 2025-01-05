import { Router } from "express";

import keysResource from "@resources/keys/keys.resource";
import manageRequest from "@middlewares/manageRequest";

const keysRouter = Router();

keysRouter.delete("/delete/:keyID", manageRequest(keysResource.deleteKey));
keysRouter.get("/info/:keyID", manageRequest(keysResource.getKeyInfo));
keysRouter.post("/create", manageRequest(keysResource.createKey));
keysRouter.get("/", manageRequest(keysResource.getUserKeys));

export default keysRouter;