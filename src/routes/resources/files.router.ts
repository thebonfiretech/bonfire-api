import { Router } from "express";

import filesResource from "@resources/files/files.resource";
import manageRequest from "@middlewares/manageRequest";
import upload from "@middlewares/upload";

const filesRouter = Router();

filesRouter.post("/upload/:scope/:id", upload.array("files", 10), manageRequest(filesResource.uploadFile, { upload: true }));

export default filesRouter;
