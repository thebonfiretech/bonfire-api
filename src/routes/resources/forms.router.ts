import { Router } from "express";

import formsResource from "@resources/forms/forms.resource";
import manageRequest from "@middlewares/manageRequest";
import hasAdmin from "@middlewares/hasAdmin";

const formsRouter = Router();

formsRouter.delete("/control/:formControlID/delete", [hasAdmin], manageRequest(formsResource.deleteFormControl));
formsRouter.patch("/control/:formControlID/update", [hasAdmin], manageRequest(formsResource.updateFormControl));
formsRouter.post("/control/create", [hasAdmin], manageRequest(formsResource.createFormControl));
formsRouter.get("/control/name/:name", manageRequest(formsResource.getFormControlWithName));
formsRouter.get("/control/:formControlID", manageRequest(formsResource.getFormControl));
formsRouter.get("/control/", [hasAdmin], manageRequest(formsResource.getFormsControl));

export default formsRouter;