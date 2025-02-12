import { Router } from "express";

import categoryResource from "@resources/category/category.resource";
import manageRequest from "@middlewares/manageRequest";

const categoryRouter = Router();

categoryRouter.delete("/:categoryID/delete", manageRequest(categoryResource.deleteCategory));
categoryRouter.patch("/:categoryID/update", manageRequest(categoryResource.updateCategory));
categoryRouter.get("/:scope/:id", manageRequest(categoryResource.getCategories));
categoryRouter.get("/:categoryID", manageRequest(categoryResource.getCategory));
categoryRouter.post("/create", manageRequest(categoryResource.createCategory));

export default categoryRouter;
