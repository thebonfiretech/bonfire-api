import { Router } from "express";

import usersResource from "@resources/users/users.resource";
import manageRequest from "@middlewares/manageRequest";

const usersRouter = Router();

usersRouter.post("/auth/signup", manageRequest(usersResource.signUp));
usersRouter.post("/auth/signin", manageRequest(usersResource.signIn));

export default usersRouter;