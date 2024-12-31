import { Router } from "express";

import adminResource from "@resources/admin/admin.resource";
import manageRequest from "@middlewares/manageRequest";

const adminRouter = Router();

adminRouter.post("/user/create", manageRequest(adminResource.createUser));

export default adminRouter;