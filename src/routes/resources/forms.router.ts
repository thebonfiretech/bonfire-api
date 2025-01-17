import { Router } from "express";

import formsResource from "@resources/forms/forms.resource";
import manageRequest from "@middlewares/manageRequest";
import hasAdmin from "@middlewares/hasAdmin";
import auth from "@middlewares/auth";

const formsRouter = Router();

formsRouter.delete("/control/:formControlID/delete", [auth, hasAdmin], manageRequest(formsResource.deleteFormControl));
formsRouter.patch("/control/:formControlID/update", [auth, hasAdmin], manageRequest(formsResource.updateFormControl));
formsRouter.post("/control/create", [auth, hasAdmin], manageRequest(formsResource.createFormControl));
formsRouter.get("/control/:formControlID/completed", manageRequest(formsResource.getCompletedForms));
formsRouter.get("/control/", [auth, hasAdmin], manageRequest(formsResource.getFormsControl));
formsRouter.get("/control/name/:name", manageRequest(formsResource.getFormControlWithName));
formsRouter.get("/control/:formControlID", manageRequest(formsResource.getFormControl));

formsRouter.get("/:name/canSendForm", [auth], manageRequest(formsResource.canSendForm));
formsRouter.post("/:name/send", manageRequest(formsResource.sendForm));

export default formsRouter;