import { Router } from "express";

import shopResource from "@resources/shop/shop.resource";
import manageRequest from "@middlewares/manageRequest";

const shopRouter = Router();

shopRouter.get("/space/:spaceID/category/:categoryID", manageRequest(shopResource.getSpaceCategoryProducts));
shopRouter.post("/products/:productID/buy", manageRequest(shopResource.buyProduct));
shopRouter.patch("/:productID/update", manageRequest(shopResource.updateProduct));
shopRouter.get("/products/random", manageRequest(shopResource.getRandomProduct));
shopRouter.get("/space/:spaceID", manageRequest(shopResource.getSpaceProducts));
shopRouter.get("/products/:productID", manageRequest(shopResource.getProduct));
shopRouter.post("/create", manageRequest(shopResource.createProduct));

export default shopRouter;