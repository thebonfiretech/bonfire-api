import createRouter from "../../middlewares/createRouter.js";
import usersController from "../../modules/base/users.controllers.js";

const test = createRouter(usersController, [
    ["get", "/ping", "ping"]
]);

export default test