import createRouter from "../../middlewares/createRouter.js";
import service from "../../modules/base/users.service.js";

export default createRouter(service, [
    ["get", "/ping", "ping"]
]);