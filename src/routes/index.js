import { Router } from "express";

import transactionRouter from "./resources/transaction.router.js";
import favoriteRouter from "./resources/favorite.router.js";
import walletRouter from "./resources/wallet.router.js";
import adminRouter from "./resources/admin.router.js";
import usersRouter from "./resources/user.router.js";
import keyRouter from "./resources/key.router.js";

export const router = Router();

router.get("/ping", (req, res) => {
  res.sendStatus(200);
});

router.use('/transaction', transactionRouter);
router.use('/favorite', favoriteRouter);
router.use('/wallet', walletRouter);
router.use('/admin', adminRouter);
router.use('/user', usersRouter);
router.use('/key', keyRouter);