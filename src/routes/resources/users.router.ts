import { Router } from "express";

import usersResource from "@resources/users/users.resource";
import manageRequest from "@middlewares/manageRequest";

const usersRouter = Router();

usersRouter.post("/", manageRequest(usersResource.getUser))

export default usersRouter;