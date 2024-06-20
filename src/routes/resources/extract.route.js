import service from "../../modules/economy/extract.service.js";
import createRouter from "../../middlewares/createRouter.js";

export default createRouter(service, [
    ["get", "/get-all", "getAllExtracts", true]
]);