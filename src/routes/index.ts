import { Router } from "express";

import controlAccess from "@middlewares/controlAccess";
import classesRouter from "./resources/classes.router";
import ticketsRouter from "./resources/tickets.router";
import spacesRouter from "./resources/spaces.router";
import usersRouter from "./resources/users.router";
import adminRouter from "./resources/admin.router";
import foodsRouter from "./resources/food.router";
import keysRouter from "./resources/keys.router";
import hasAdmin from "@middlewares/hasAdmin";
import auth from "@middlewares/auth";
import postsRouter from "./resources/posts.router";

const router = Router();

router.get("/ping", (req, res) => {
    res.sendStatus(200);
});

router.use("/admin", [controlAccess, auth, hasAdmin],  adminRouter);
router.use("/tickets", [controlAccess, auth],  ticketsRouter);
router.use("/classes", [controlAccess, auth],  classesRouter);
router.use("/spaces", [controlAccess, auth],  spacesRouter);
router.use("/posts", [controlAccess, auth],  postsRouter);
router.use("/foods", [controlAccess, auth],  foodsRouter);
router.use("/keys", [controlAccess, auth],  keysRouter);
router.use("/users", [controlAccess],  usersRouter);

export default router;