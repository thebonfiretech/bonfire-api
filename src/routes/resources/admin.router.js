import createRouter from "../../middlewares/createRouter.js";
import service from "../../modules/admin/admin.service.js";

export default createRouter(service, [
    ["post", "/school/create", "createSchool"],
]);