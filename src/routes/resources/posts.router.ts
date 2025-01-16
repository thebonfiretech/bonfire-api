import { Router } from "express";

import postsResource from "@resources/posts/posts.resource";
import manageRequest from "@middlewares/manageRequest";

const postsRouter = Router();

postsRouter.patch("/:postID/update", manageRequest(postsResource.updatePost));
postsRouter.delete("/:postID/delete", manageRequest(postsResource.deletePost));
postsRouter.get("/:id/:scope", manageRequest(postsResource.getPostsWithScope));
postsRouter.post("/create", manageRequest(postsResource.createPost));
postsRouter.get("/:postID", manageRequest(postsResource.getPost));

export default postsRouter;