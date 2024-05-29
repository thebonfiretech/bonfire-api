import service from "../../modules/economy/wallet.service.js";
import createRouter from "../../middlewares/createRouter.js";

export default createRouter(service, [
    ["post", "/create", "createWallet", true],
]);