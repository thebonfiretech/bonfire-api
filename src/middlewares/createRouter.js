import { Router } from "express";
import auth from "./auth.js";

const createRouter = (controller, routes) => {
    const router = Router();
    const service = new controller();

    routes.map(([type, route, action, authentication]) => {
        var middlewares = [];
        if (authentication) middlewares.push(auth);
        router[type](route, middlewares, service[action])
    })

    return router
}

export default createRouter;