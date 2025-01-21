import { Router } from "express";

import economyResource from "@resources/economy/economy.resource";
import manageRequest from "@middlewares/manageRequest";

const economyRouter = Router();

economyRouter.get("/transactions", manageRequest(economyResource.getTransactions));
economyRouter.post("/pix/:keyID", manageRequest(economyResource.sendPix));

export default economyRouter;