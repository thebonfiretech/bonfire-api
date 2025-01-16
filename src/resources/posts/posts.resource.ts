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
    getPosts: async ({ manageError, params }: ManageRequestBody) => {
        try {
            const { scope, id } =  params;
            if (!scope || !id) return manageError({ code: "invalid_params" });

            let extra = {
                scope
            };

            if (scope == "space" && scope == "class" && scope == "role"){
                extra = {
                    ...extra,
                    [`${scope}.id`]: id
                }
            };

            return await postModel.find(extra);
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    updatePost: async ({ manageError, params, data, ids }: ManageRequestBody) => {
        try {
            const { postID } =  params;
            if (!postID) return manageError({ code: "invalid_params" });

            const post = await postModel.findById(postID);
            if (!post) return manageError({ code: "post_not_found" });
            
            const { userID } = ids;
            const user = await hasUser({ _id: userID }, manageError);
            if (!user) return;

            if (user._id != (post.creator?.id || "").toString()) return manageError({ code: "no_execution_permission" });

            let filteredPost = objectService.getObject(data, ["title", "content", "attachments", "type"]);

            if (filteredPost.content) filteredPost.content = stringService.filterBadwords(stringService.normalizeString(filteredPost.content));
            if (filteredPost.title) filteredPost.title = stringService.filterBadwords(stringService.normalizeString(filteredPost.title));

            return await postModel.findByIdAndUpdate(postID, { $set:{ ...filteredPost, lastUpdate: Date.now() } }, { new: true });
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    deletePost: async ({ manageError, params, data, ids }: ManageRequestBody) => {
        try {
            const { postID } =  params;
            if (!postID) return manageError({ code: "invalid_params" });

            const post = await postModel.findById(postID);
            if (!post) return manageError({ code: "post_not_found" });
            
            const { userID } = ids;
            const user = await hasUser({ _id: userID }, manageError);
            if (!user) return;

            if (user._id != (post.creator?.id || "").toString()) return manageError({ code: "no_execution_permission" });
            
            await postModel.findByIdAndDelete(postID);

            return {
                delete: true
            };
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    }, 
};

export default postsResource;