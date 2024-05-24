import createRouter from "../../middlewares/createRouter.js";
import service from "../../modules/admin/admin.service.js";

export default createRouter(service, [
    ["delete", "/school/delete", "deleteSchool"],
    ["post", "/school/create", "createSchool"],
    ["put", "/school/update", "updateSchool"],
    ["get", "/school/get-all", "getSchools"],
    ["get", "/school/get/:id", "getSchool"],

    ["post", "/user/create", "createUserPayload"],
]);