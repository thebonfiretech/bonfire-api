import createRouter from "../../middlewares/createRouter.js";
import service from "../../modules/base/user.service.js";

export default createRouter(service, [
    ["post", "/auth/signup", "signUp"],
    ["post", "/auth/signin", "signIn"],
    ["get", "/auth/me", "me", true],

    ["put", "/update", "update", true]
]);