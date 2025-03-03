import { Router } from "express";

import foodResource from "@resources/food/food.resource";
import manageRequest from "@middlewares/manageRequest";

const foodsRouter = Router();

foodsRouter.get("/space/:spaceID", manageRequest(foodResource.getSpaceFoods));
foodsRouter.delete("/:foodID/delete", manageRequest(foodResource.deleteFood));
foodsRouter.patch("/:foodID/update", manageRequest(foodResource.updateFood));
foodsRouter.post("/create", manageRequest(foodResource.createFood));
foodsRouter.get("/:foodID", manageRequest(foodResource.getFood));


export default foodsRouter;