import { Router } from "express";

import economyResource from "@resources/economy/economy.resource";
import manageRequest from "@middlewares/manageRequest";

const economyRouter = Router();

economyRouter.get("/transactions", manageRequest(economyResource.getTransactions));
economyRouter.post("/pix/:keyID", manageRequest(economyResource.sendPix));

economyRouter.post("/:spaceID/investments/create", manageRequest(economyResource.createInvestment));

export default economyRouter;