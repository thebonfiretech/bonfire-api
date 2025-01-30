import { Router } from "express";

import economyResource from "@resources/economy/economy.resource";
import manageRequest from "@middlewares/manageRequest";

const economyRouter = Router();

economyRouter.get("/transactions", manageRequest(economyResource.getTransactions));
economyRouter.post("/pix/:keyID", manageRequest(economyResource.sendPix));

economyRouter.get("/investments/generate/random", manageRequest(economyResource.generateRandomInvestment));
economyRouter.patch("/investments/:investmentID/delete", manageRequest(economyResource.deleteInvestment));
economyRouter.patch("/investments/:investmentID/update", manageRequest(economyResource.updateInvestment));
economyRouter.post("/:spaceID/investments/create", manageRequest(economyResource.createInvestment));
economyRouter.get("/:spaceID/investments", manageRequest(economyResource.getInvestments));

economyRouter.patch("/investments/:investmentID/wallet/add", manageRequest(economyResource.updateInvestment));

export default economyRouter;