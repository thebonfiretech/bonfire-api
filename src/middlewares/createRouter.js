import { Router } from "express";

import handleRequest from "./handleRequest.js";
import auth from "./auth.js";

const createRouter = (controller, routes) => {
    const router = Router();
    const service = new controller();

    routes.map(async ([type, route, action, authentication]) => {
        var middlewares = [];
        if (authentication) middlewares.push(auth);
        router[type](route, middlewares, async (req, res) => handleRequest(req, res, service[action]))
    })

    return router
}

export default createRouter;