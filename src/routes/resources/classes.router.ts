import { Router } from "express";

import classesResource from "@resources/classes/classes.resource";
import manageRequest from "@middlewares/manageRequest";

const classesRouter = Router();

classesRouter.patch("/:classID/update", manageRequest(classesResource.updateClass));
classesRouter.delete("/:classID/delete", manageRequest(classesResource.deleteClass));
classesRouter.post("/create", manageRequest(classesResource.createClass));
classesRouter.get("/:classID", manageRequest(classesResource.getClass));

classesRouter.post("/:classID/users/remove", manageRequest(classesResource.removeClassUser));
classesRouter.post("/:classID/users/add", manageRequest(classesResource.addClassUser));
classesRouter.get("/:classID/users", manageRequest(classesResource.getClassUsers));

classesRouter.get("/space/:spaceID", manageRequest(classesResource.getSpaceClasses));
classesRouter.get("/space/user/:spaceID/:userID", manageRequest(classesResource.getSpaceUserClasses));

export default classesRouter;