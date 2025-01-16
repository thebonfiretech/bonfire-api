import { ManageRequestBody } from "@middlewares/manageRequest";
import { hasRolePermission } from "@database/functions/space";
import stringService from "@utils/services/stringServices";
import objectService from "@utils/services/objectServices";
import { UserClassType } from "@utils/types/models/user";
import { hasUser } from "@database/functions/user";
import spaceModel from "@database/model/space";
import classModel from "@database/model/class";
import userModel from "@database/model/user";
import { PostModelType, PostScopeType } from "@utils/types/models/post";
import { ObjectId } from "mongoose";
import postModel from "@database/model/post";

const postsResource = {
    createPost: async ({ manageError, data, ids }: ManageRequestBody) => {
        try {
            let { title, content, spaceID, classID, roleID, attachments, type, scope } = data;
            if (!title || !content || !type || !scope || (!classID && !roleID && !spaceID)) return manageError({ code: "invalid_data" });

            content = stringService.filterBadwords(stringService.normalizeString(content));
            title = stringService.filterBadwords(stringService.normalizeString(title));

            const { userID } = ids;

            const creator = await hasUser({ _id: userID }, manageError);
            if (!creator) return;

            let hasPermisson = true;

            let extra: Partial<PostModelType> = {};

            switch (scope as PostScopeType) {
                case "all":
                case "administrators":
                    if (creator.role !== "admin") hasPermisson = false;    
                break;
                case "space":
                    const space = creator.spaces?.find(x => x.id == spaceID);
                    if (!space) return manageError({ code: "user_not_in_space" });
                    if (!(await hasRolePermission(space?.role.toString() || "", ["administrator", "manage_posts", "owner"]))) hasPermisson = false;
                    extra.space = {
                        name: space?.name || "",
                        id: space.id as any,
                    };
                break;
                case "class":
                    const classe = await classModel.findById(classID);
                    if (!classe) return manageError({ code: "class_not_found" });
                    const classSpace = creator.spaces?.find(x => x.id == String(classe.space?.id));
                    if (!(await hasRolePermission(classSpace?.role.toString() || "", ["administrator", "manage_posts", "owner"]))) hasPermisson = false;
                break;
                case "role":
                    const roleSpace = creator.spaces?.find(x => x.id == spaceID);
                    if (!roleSpace) return manageError({ code: "user_not_in_space" });
                    if (!(await hasRolePermission(roleSpace?.role.toString() || "", ["administrator", "manage_posts", "owner"]))) hasPermisson = false;
                    
                    const creatorSpace = await spaceModel.findOne({ "space.role.id": roleID });
                    if (!creatorSpace) hasPermisson = false;
                    const role =  Array.isArray(creatorSpace?.roles as any) ? (creatorSpace as any).roles.find((x: any) =>  String(x._id), String(roleID)) : null;
                    extra.role = {
                        id: role._id,
                        name: role.name
                    };
                break;           
                default:
                break;
            }

            if (!hasPermisson) return manageError({ code: "no_execution_permission" });
            
            const newPost = new postModel({
                ...extra,
                lastUpdate: new Date(Date.now()),
                title,
                content,
                type,
                scope,
                attachments,
                creator: {
                    name: creator.name,
                    id: creator._id,
                }   
            });

            return await newPost.save()
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    getPost: async ({ manageError, params }: ManageRequestBody) => {
        try {
            const { postID } =  params;
            if (!postID) return manageError({ code: "invalid_params" });

            const post = await postModel.findById(postID);
            if (!post) return manageError({ code: "post_not_found" });

            return post;
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    getClassUsers: async ({ manageError, params }: ManageRequestBody) => {
        try {
            const { classID } =  params;
            if (!classID) return manageError({ code: "invalid_params" });

            const classe = await classModel.findById(classID);
            if (!classe) return manageError({ code: "class_not_found" });

            return await userModel.find({ "classes.id": classID }).select("-password");
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    getSpaceClasses: async ({ manageError, params }: ManageRequestBody) => {
        try {
            const { spaceID } =  params;
            if (!spaceID) return manageError({ code: "invalid_params" });

            return await classModel.find({ spaceID });
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    updateClass: async ({ manageError, params, data, ids }: ManageRequestBody) => {
        try {
            const { classID } =  params;
            if (!classID) return manageError({ code: "invalid_params" });

            const classe = await classModel.findById(classID);
            if (!classe) return manageError({ code: "class_not_found" });
            const { userID } = ids;

            const user = await hasUser({ _id: userID }, manageError);
            if (!user) return;

            const userSpace = user.spaces?.find(x => x.id == String(classe?.space?.id || ""));
            const hasPermisson = await hasRolePermission(userSpace?.role.toString() || "", ["administrator", "manage_space", "manage_classes", "owner"]);
            if (!hasPermisson) return manageError({ code: "no_execution_permission" });

            const filteredClass = objectService.filterObject(data, ["createAt", "_id", "space"]);

            if (filteredClass.name){
                filteredClass.name = stringService.normalizeString(filteredClass.name);

                const usersWithClasses = await userModel.find({ "classes.id": classID });
                for (const classUser of usersWithClasses) {
                    const index = classUser.classes.findIndex(classe => String(classe.id) === String(classID));
                    if (index) {
                        classUser.classes[index].name = filteredClass.name;
                        await classUser.save();
                    };
                };
            };

            if (filteredClass.description){
                filteredClass.description = stringService.normalizeString(filteredClass.description);
            };

            return await classModel.findByIdAndUpdate(classID, { $set:{ ...filteredClass, lastUpdate: Date.now() } }, { new: true });
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    deleteClass: async ({ manageError, params, data, ids }: ManageRequestBody) => {
        try {
            const { classID } =  params;
            if (!classID) return manageError({ code: "invalid_params" });

            const classe = await classModel.findById(classID);
            if (!classe) return manageError({ code: "class_not_found" });
            const { userID } = ids;

            const user = await hasUser({ _id: userID }, manageError);
            if (!user) return;

            const userSpace = user.spaces?.find(x => x.id == String(classe?.space?.id || ""));
            const hasPermisson = await hasRolePermission(userSpace?.role.toString() || "", ["owner"]);
            if (!hasPermisson) return manageError({ code: "no_execution_permission" });

            const usersWithClasses = await userModel.find({ "classes.id": classID });
            for (const classUser of usersWithClasses) {
                classUser.classes.pull({ id: classID });
                await classUser.save();
            };
           
            await classModel.findByIdAndDelete(classID);

            return {
                delete: true
            };
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    addClassUser: async ({ manageError, params, data, ids }: ManageRequestBody) => {
        try {
            const { classID } =  params;
            if (!classID) return manageError({ code: "invalid_params" });

            const classe = await classModel.findById(classID);
            if (!classe) return manageError({ code: "class_not_found" });
            const { userID } = ids;

            const user = await hasUser({ _id: userID }, manageError);
            if (!user) return;

            const userSpace = user.spaces?.find(x => x.id == String(classe?.space?.id || ""));
            const hasPermisson = await hasRolePermission(userSpace?.role.toString() || "", ["administrator", "manage_classes", "owner"]);
            if (!hasPermisson) return manageError({ code: "no_execution_permission" });

            let { id } = data;
            if (!id) return manageError({ code: "invalid_data" });

            id = stringService.removeSpacesAndLowerCase(id);

            const invitedUser = await hasUser({ _id: id }, manageError);
            if (!invitedUser) return;

            const hasExistentClass = invitedUser.classes?.find(x => String(x.id) == classID);
            if (hasExistentClass) return manageError({ code: "user_already_in_class"});

            let newClass = {
                entryAt: new Date(),
                name: classe.name,
                id: classe._id
            };
        
            const classes  = [...(invitedUser.classes || []), newClass];

            let classUserMetrics = classe.metrics?.users || 0;

            await classModel.findByIdAndUpdate(classID, { $set:{ metrics: { user: classUserMetrics + 1 } } }, { new: true });
            
            const updatedUser  = await userModel.findByIdAndUpdate(invitedUser._id, { $set:{ classes, lastUpdate: Date.now() } }, { new: true }).select("-password");

            return {
                user: updatedUser
            };
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    removeClassUser: async ({ manageError, params, data, ids }: ManageRequestBody) => {
        try {
            const { classID } =  params;
            if (!classID) return manageError({ code: "invalid_params" });

            const classe = await classModel.findById(classID);
            if (!classe) return manageError({ code: "class_not_found" });
            const { userID } = ids;

            const user = await hasUser({ _id: userID }, manageError);
            if (!user) return;

            const userSpace = user.spaces?.find(x => x.id == String(classe?.space?.id || ""));
            const hasPermisson = await hasRolePermission(userSpace?.role.toString() || "", ["administrator", "manage_classes", "owner"]);
            if (!hasPermisson) return manageError({ code: "no_execution_permission" });

            let { id } = data;
            if (!id) return manageError({ code: "invalid_data" });

            id = stringService.removeSpacesAndLowerCase(id);

            const removedUser = await hasUser({ _id: id }, manageError);
            if (!removedUser) return;

            const hasExistentClass = removedUser.classes?.find(x => String(x.id) == classID);
            if (!hasExistentClass) return manageError({ code: "user_not_in_class" });
        
            const classes = removedUser.classes?.filter(x => String(x.id) != classID);

            let classUserMetrics = classe.metrics?.users || 0;

            await classModel.findByIdAndUpdate(classID, { $set:{ metrics: { user: classUserMetrics - 1 } } }, { new: true });
            
            const updatedUser  = await userModel.findByIdAndUpdate(removedUser._id, { $set:{ classes, lastUpdate: Date.now() } }, { new: true }).select("-password");

            return {
                user: updatedUser
            };
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
};

export default postsResource;