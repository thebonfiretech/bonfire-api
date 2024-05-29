import createRouter from "../../middlewares/createRouter.js";
import service from "../../modules/economy/key.service.js";

export default createRouter(service, [
    ["delete", "/delete", "deleteKey", true],
    ["get", "/get/:key", "getKeyData", true],
    ["get", "/get-all", "getAllKeys", true],
    ["post", "/create", "createKey", true],
]);