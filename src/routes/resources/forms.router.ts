import { Router } from "express";

import formsResource from "@resources/forms/forms.resource";
import manageRequest from "@middlewares/manageRequest";
import hasAdmin from "@middlewares/hasAdmin";

const formsRouter = Router();

formsRouter.post("/control/create", [hasAdmin], manageRequest(formsResource.createFormControl));

export default formsRouter;