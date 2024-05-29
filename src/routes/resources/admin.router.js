import createRouter from "../../middlewares/createRouter.js";
import service from "../../modules/admin/admin.service.js";

export default createRouter(service, [
    ["get", "/school/users/:school", "getAllSchoolUsers", true],
    ["delete", "/school/delete", "deleteSchool", true],
    ["post", "/school/create", "createSchool", true],
    ["put", "/school/update", "updateSchool", true],
    ["get", "/school/get-all", "getSchools", true],
    ["get", "/school/get/:id", "getSchool", true],

    ["post", "/user/create", "createUserPayload", true],
    ["delete", "/user/delete", "deleteUser", true],
    ["get", "/user/get-all", "getAllUsers", true],
    ["put", "/user/update", "updateUser", true],
    ["get", "/user/get/:id", "getUser", true],

    ["get", "/investments/get-all", "getAllInvestments", true],
    ["post", "/investments/create", "createInvestment", true],
    ["put", "/investments/update", "updateInvestment", true],
]);