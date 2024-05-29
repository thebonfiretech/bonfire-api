import { Router } from "express";

import usersRouter from "./resources/user.router.js";
import adminRouter from "./resources/admin.router.js";
import keyRouter from "./resources/key.router.js";

export const router = Router();

router.get("/ping", (req, res) => {
  res.sendStatus(200);
});

router.use('/admin', adminRouter);
router.use('/user', usersRouter);
router.use('/key', keyRouter);