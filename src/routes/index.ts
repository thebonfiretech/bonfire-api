import { Router } from "express";

import controlAccess from "@middlewares/controlAccess";
import usersRouter from "./resources/users.router";
import adminRouter from "./resources/admin.router";

const router = Router();

router.get("/ping", (req, res) => {
    res.sendStatus(200);
});

router.use("/users", [controlAccess],  usersRouter);
router.use("/admin", [controlAccess],  adminRouter);

export default router;