import createRouter from "../../middlewares/createRouter.js";
import service from "../../modules/economy/transaction.service.js";

export default createRouter(service, [
    ["post", "/create", "createFavorites", true],
]);