import { Router } from "express";

import categoryRouter from "./resources/category.router";
import controlAccess from "@middlewares/controlAccess";
import classesRouter from "./resources/classes.router";
import ticketsRouter from "./resources/tickets.router";
import economyRouter from "./resources/economy.router";
import spacesRouter from "./resources/spaces.router";
import usersRouter from "./resources/users.router";
import adminRouter from "./resources/admin.router";
import postsRouter from "./resources/posts.router";
import formsRouter from "./resources/forms.router";
import filesRouter from "./resources/files.router";
import foodsRouter from "./resources/food.router";
import shopRouter from "./resources/shop.router";
import keysRouter from "./resources/keys.router";
import hasAdmin from "@middlewares/hasAdmin";
import auth from "@middlewares/auth";

const router = Router();

router.get("/ping", (req, res) => {
    res.sendStatus(200);
});

router.use("/admin", [controlAccess, auth, hasAdmin],  adminRouter);
router.use("/categorys", [controlAccess, auth],  categoryRouter);
router.use("/tickets", [controlAccess, auth],  ticketsRouter);
router.use("/economy", [controlAccess, auth],  economyRouter);
router.use("/classes", [controlAccess, auth],  classesRouter);
router.use("/spaces", [controlAccess, auth],  spacesRouter);
router.use("/posts", [controlAccess, auth],  postsRouter);
router.use("/files", [controlAccess, auth],  filesRouter);
router.use("/foods", [controlAccess, auth],  foodsRouter);
router.use("/shop", [controlAccess, auth],  shopRouter);
router.use("/keys", [controlAccess, auth],  keysRouter);
router.use("/forms", [controlAccess],  formsRouter);
router.use("/users", [controlAccess],  usersRouter);

export default router;