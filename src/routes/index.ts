import { Router } from "express";

import controlAccess from "@middlewares/controlAccess";
import spacesRouter from "./resources/spaces.router";
import usersRouter from "./resources/users.router";
import adminRouter from "./resources/admin.router";
import keysRouter from "./resources/keys.router";
import hasAdmin from "@middlewares/hasAdmin";
import auth from "@middlewares/auth";

const router = Router();

router.get("/ping", (req, res) => {
    res.sendStatus(200);
});

router.use("/admin", [controlAccess, auth, hasAdmin],  adminRouter);
router.use("/spaces", [controlAccess, auth],  spacesRouter);
router.use("/keys", [controlAccess, auth],  keysRouter);
router.use("/users", [controlAccess],  usersRouter);

export default router;