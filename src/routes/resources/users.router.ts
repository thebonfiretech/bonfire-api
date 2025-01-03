import { Router } from "express";

import usersResource from "@resources/users/users.resource";
import manageRequest from "@middlewares/manageRequest";

const usersRouter = Router();

usersRouter.post("/signup", manageRequest(usersResource.signUp))

export default usersRouter;