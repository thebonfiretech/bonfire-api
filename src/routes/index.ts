import { Router } from "express";

import controlAccess from "@middlewares/controlAccess";
import usersRouter from "./resources/user.router";

const router = Router();

router.get("/ping", (req, res) => {
    res.sendStatus(200);
});

router.use("/users", [controlAccess],  usersRouter);

export default router;