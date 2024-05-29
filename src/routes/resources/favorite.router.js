import createRouter from "../../middlewares/createRouter.js";
import service from "../../modules/economy/favorite.service.js";

export default createRouter(service, [
    ["delete", "/delete", "deleteFavorites", true],
    ["get", "/get-all", "getAllFavorites", true],
    ["post", "/create", "createFavorites", true],
]);