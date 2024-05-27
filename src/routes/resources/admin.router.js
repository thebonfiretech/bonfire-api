import createRouter from "../../middlewares/createRouter.js";
import service from "../../modules/admin/admin.service.js";

export default createRouter(service, [
    ["get", "/school/users/:school", "getAllSchoolUsers"],
    ["delete", "/school/delete", "deleteSchool"],
    ["post", "/school/create", "createSchool"],
    ["put", "/school/update", "updateSchool"],
    ["get", "/school/get-all", "getSchools"],
    ["get", "/school/get/:id", "getSchool"],

    ["post", "/user/create", "createUserPayload"],
    ["delete", "/user/delete", "deleteUser"],
    ["get", "/user/get-all", "getAllUsers"],
    ["put", "/user/update", "updateUser"],
    ["get", "/user/get/:id", "getUser"],
]);