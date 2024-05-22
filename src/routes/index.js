import { Router } from "express";

import usersRouter from "./resources/users.router.js";
import test from "./resources/test.router.js";

export const router = Router();

router.get("/ping", (req, res) => {
  res.sendStatus(200);
});

router.use('/user', usersRouter);
router.use('/test', test);