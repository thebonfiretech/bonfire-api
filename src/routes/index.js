import { Router } from "express";

import usersRouter from "./resources/users.router.js";
import adminRouter from "./resources/admin.router.js";

export const router = Router();

router.get("/ping", (req, res) => {
  res.sendStatus(200);
});

router.use('/admin', adminRouter);
router.use('/user', usersRouter);