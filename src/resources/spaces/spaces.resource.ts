import { UserModelType, UserSpaceType } from "bonfire-shared-types";
import { hasExistsUser, hasUser } from "@database/functions/user";
import { ManageRequestBody } from "@middlewares/manageRequest";
import { hasSpace } from "@database/functions/space";
import stringService from "@utils/services/stringServices";
import spaceModel from "@database/model/space";
import userModel from "@database/model/user";
import classModel from "@database/model/class";
import postModel from "@database/model/post";
import ticketModel from "@database/model/ticket";
import { ObjectId, Types } from "mongoose";

const spacesResource = {
    getSpace: async ({ manageError, params }: ManageRequestBody) => {
        try {
            const { spaceID } =  params;
            if (!spaceID) return manageError({ code: "invalid_params" });

            return await hasSpace({ _id: spaceID }, manageError);
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    getFullSpace: async ({ manageError, params, ids }: ManageRequestBody) => {
        try {
            const { spaceID } =  params;
            if (!spaceID) return manageError({ code: "invalid_params" });

            const space = await hasSpace({ _id: spaceID }, manageError);
            if (!space) return;

            const user = await userModel.findById(ids.userID);

            const userSpace = user?.spaces.find(x => x.id == spaceID);

            const role = Array.isArray(space.roles) ? space.roles.find((x: any) => String(x._id) === String(userSpace?.role)) : null;

            return {
                space,
                role,
            };
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    getSpaceMetrics: async ({ manageError, params, ids, manageCheckUserHasPermissions }: ManageRequestBody) => {
        try {
            const { spaceID } = params;
            if (!spaceID) return manageError({ code: "invalid_params" });

            const { userID } = ids;
            const user = await hasUser({ _id: userID }, manageError);
            if (!user) return;

            if (!manageCheckUserHasPermissions(user, ["manage_space", "administrator"])) return;

            const space = await hasSpace({ _id: spaceID }, manageError);
            if (!space) return;

            const [users, classes, posts, tickets] = await Promise.all([
                userModel.find({ "spaces.id": spaceID }).select("-password"),
                classModel.find({ "space.id": spaceID }),
                postModel.find({ "space.id": spaceID }),
                ticketModel.find({ spaceID, scope: "space" })
            ]);

            const usersByRole = users.reduce((acc, user) => {
                const userSpace = user.spaces?.find(s => String(s.id) === spaceID);
                const roleId = String(userSpace?.role || "unknown");
                const role = space.roles?.find(r => String(r._id) === roleId);
                const roleName = role?.name || "Sem cargo";
                
                acc[roleName] = (acc[roleName] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);

            const roleDistribution = Object.entries(usersByRole).map(([name, value]) => ({
                name,
                value,
                percentage: Math.round((value / users.length) * 100)
            }));

            const userJoinTrend = users.reduce((acc, user) => {
                const userSpace = user.spaces?.find(s => String(s.id) === spaceID);
                const entryDate = userSpace?.entryAt ? new Date(userSpace.entryAt) : new Date();
                const monthYear = `${entryDate.getMonth() + 1}/${entryDate.getFullYear()}`;
                
                acc[monthYear] = (acc[monthYear] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);

            const joinTrendData = Object.entries(userJoinTrend)
                .sort(([a], [b]) => {
                    const [monthA, yearA] = a.split('/').map(Number);
                    const [monthB, yearB] = b.split('/').map(Number);
                    return new Date(yearA, monthA - 1).getTime() - new Date(yearB, monthB - 1).getTime();
                })
                .map(([month, count]) => ({
                    month,
                    usuarios: count
                }));

            const userStatusDistribution = users.reduce((acc, user) => {
                acc[user.status] = (acc[user.status] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);

            const statusData = Object.entries(userStatusDistribution).map(([name, value]) => ({
                name: name === "loggedIn" ? "Logado" : name === "registered" ? "Registrado" : "Bloqueado",
                value,
                percentage: Math.round((value / users.length) * 100)
            }));

            const ticketsByStatus = tickets.reduce((acc, ticket) => {
                const status = ticket.status === "pending" ? "Pendente" : 
                             ticket.status === "answered" ? "Respondido" :
                             ticket.status === "progress" ? "Em progresso" : "Concluído";
                acc[status] = (acc[status] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);

            const ticketsData = Object.entries(ticketsByStatus).map(([name, value]) => ({
                name,
                value
            }));

            const postsByType = posts.reduce((acc, post) => {
                const type = post.type === "default" ? "Padrão" :
                           post.type === "report" ? "Relatório" : "Aviso";
                acc[type] = (acc[type] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);

            const postsData = Object.entries(postsByType).map(([name, value]) => ({
                name,
                value
            }));

            const totalCoins = users.reduce((acc, user) => acc + (user.coins || 0), 0);
            const averageCoins = users.length > 0 ? Math.round(totalCoins / users.length) : 0;

            const activeModules = Object.entries(space.modules || {})
                .filter(([_, module]: [string, any]) => module.status === "active")
                .map(([name]) => name);

            return {
                summary: {
                    totalUsers: users.length,
                    totalRoles: space.roles?.length || 0,
                    totalClasses: classes.length,
                    totalPosts: posts.length,
                    totalTickets: tickets.length,
                    totalCoins,
                    averageCoins,
                    spaceCoins: space.coins || 0,
                    activeModules: activeModules.length,
                    modulesList: activeModules
                },
                charts: {
                    roleDistribution,
                    userJoinTrend: joinTrendData,
                    userStatus: statusData,
                    ticketStatus: ticketsData,
                    postTypes: postsData
                },
                details: {
                    roles: space.roles?.map(role => ({
                        name: role.name,
                        permissions: role.permissions?.length || 0,
                        users: usersByRole[role.name] || 0,
                        isSystem: role.system || false
                    })) || [],
                    recentUsers: users
                        .sort((a, b) => {
                            const aSpace = a.spaces?.find(s => String(s.id) === spaceID);
                            const bSpace = b.spaces?.find(s => String(s.id) === spaceID);
                            const aDate = aSpace?.entryAt ? new Date(aSpace.entryAt).getTime() : 0;
                            const bDate = bSpace?.entryAt ? new Date(bSpace.entryAt).getTime() : 0;
                            return bDate - aDate;
                        })
                        .slice(0, 10)
                        .map(user => {
                            const userSpace = user.spaces?.find(s => String(s.id) === spaceID);
                            const role = space.roles?.find(r => String(r._id) === String(userSpace?.role));
                            return {
                                id: user.id,
                                name: user.name,
                                role: role?.name || "Sem cargo",
                                entryAt: userSpace?.entryAt,
                                coins: user.coins || 0
                            };
                        })
                }
            };
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    getSpaceRoles: async ({ manageError, params }: ManageRequestBody) => {
        try {
            const { spaceID } =  params;
            if (!spaceID) return manageError({ code: "invalid_params" });

            const space = await hasSpace({ _id: spaceID }, manageError);
            if (!space) return;

            return space.roles || [];
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    getSpaceUsers: async ({ manageError, params, querys }: ManageRequestBody) => {
        try {
          const { spaceID } = params;
          if (!spaceID) return manageError({ code: "invalid_params" });
      
          const pageNum = Number(querys.page) || 1;
          const limitNum = Number(querys.limit) || 10;
          if (pageNum < 1 || limitNum < 1) return manageError({ code: "invalid_params" });
      
          const space = await hasSpace({ _id: spaceID }, manageError);
          if (!space) return;
      
          const skip = (pageNum - 1) * limitNum;
          const [users, total] = await Promise.all([
            userModel.find({ "spaces.id": spaceID }).skip(skip).limit(limitNum).select("-password"),
            userModel.countDocuments({ "spaces.id": spaceID })
          ]);
      
          return {
            data: users,
            meta: {
              total,
              page: pageNum,
              pages: Math.ceil(total / limitNum),
              limit: limitNum
            }
          };
        } catch (error) {
          manageError({ code: "internal_error", error });
        }
      },
    createSpaceRole: async ({ manageError, params, data, ids, manageCheckUserHasPermissions }: ManageRequestBody) => {
        try {
            const { spaceID } =  params;
            if (!spaceID) return manageError({ code: "invalid_params" });

            const space = await hasSpace({ _id: spaceID }, manageError);
            if (!space) return;

            let { name, permissions } = data;
            if (!name || !permissions) return manageError({ code: "invalid_data" });

            const { userID } = ids;

            const user = await hasUser({ _id: userID }, manageError);
            if (!user) return;

            if (!manageCheckUserHasPermissions(user, ["manage_roles"])) return;

            name = stringService.removeSpacesAndLowerCase(name);

            const hasExistentRole = Array.isArray(space.roles) ? space.roles.find((x: any) => x.name === name) : null;
            if (hasExistentRole) return manageError({ code: "role_already_exists" });

            const newRole = {
                _id: new Types.ObjectId().toString(),
                permissions,
                system: false,
                name
            };

            if (Array.isArray(space.roles)){
                space.roles.push(newRole);    
            };

            return await spaceModel.findByIdAndUpdate(spaceID, { $set:{ ...space, lastUpdate: Date.now() } }, { new: true });          
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    createSpaceUser: async ({ manageError, params, data, ids, manageCheckUserHasPermissions }: ManageRequestBody) => {
        try {
            const { spaceID } =  params;
            if (!spaceID) return manageError({ code: "invalid_params" });

            const space = await hasSpace({ _id: spaceID }, manageError);
            if (!space) return;

            let { id, name, roleID } = data;
            if (!id || !name) return manageError({ code: "invalid_data" });

            const { userID } = ids;

            const user = await hasUser({ _id: userID }, manageError);
            if (!user) return;

            if (!manageCheckUserHasPermissions(user, ["manage_users"])) return;

            id = stringService.removeSpacesAndLowerCase(id);
            name = stringService.normalizeString(name);

            const userExists = await hasExistsUser({ id }, manageError);
            if (!userExists) return;

            const extra: Partial<UserModelType> = {
                lastUpdate: new Date(Date.now()),
            };

            const normalRole = Array.isArray(space.roles) ? space.roles.find((x: any) =>  x.name == "normal") : null;
            if (!normalRole) return manageError({ code: "role_not_found" });

            let newSpace: UserSpaceType= {
                entryAt: new Date(),
                role: roleID ? roleID : normalRole._id,
                name: space.name,
                id: space._id
            };
        
            extra.spaces = [newSpace];

            let spaceUserMetrics = space.metrics?.users || 0;

            await spaceModel.findByIdAndUpdate(space._id, { $set:{ metrics: { user: spaceUserMetrics + 1 } } }, { new: true });
            
            const createdUser = new userModel({ id, name, ...extra });
            await createdUser.save();

            return createdUser;
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    addSpaceUser: async ({ manageError, params, data, ids, manageCheckUserHasPermissions }: ManageRequestBody) => {
        try {
            const { spaceID } =  params;
            if (!spaceID) return manageError({ code: "invalid_params" });

            const space = await hasSpace({ _id: spaceID }, manageError);
            if (!space) return;

            let { id, roleID } = data;
            if (!id) return manageError({ code: "invalid_data" });

            const { userID } = ids;

            const user = await hasUser({ _id: userID }, manageError);
            if (!user) return;

            if (!manageCheckUserHasPermissions(user, ["manage_users"])) return;

            id = stringService.removeSpacesAndLowerCase(id);

            const invitedUser = await hasUser({ _id: id }, manageError);
            if (!invitedUser) return;

            const hasExistentSpace = invitedUser.spaces?.find((x: any) => String(x.id) == spaceID);
            if (hasExistentSpace) return manageError({ code: "user_already_in_space"});

            const normalRole = Array.isArray(space.roles) ? space.roles.find((x: any) =>  x.name == "normal") : null;
            if (!normalRole) return manageError({ code: "role_not_found" });

            let newSpace: UserSpaceType= {
                role: roleID ? roleID : normalRole._id,
                entryAt: new Date(),
                name: space.name,
                id: space._id
            };
        
            const spaces  = [...(invitedUser.spaces || []), newSpace];

            let spaceUserMetrics = space.metrics?.users || 0;

            await spaceModel.findByIdAndUpdate(space._id, { $set:{ metrics: { user: spaceUserMetrics + 1 } } }, { new: true });
            
            const updatedUser  = await userModel.findByIdAndUpdate(invitedUser._id, { $set:{ spaces, lastUpdate: Date.now() } }, { new: true }).select("-password");

            return updatedUser;
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    removeSpaceUser: async ({ manageError, params, data, ids, manageCheckUserHasPermissions }: ManageRequestBody) => {
        try {
            const { spaceID } =  params;
            if (!spaceID) return manageError({ code: "invalid_params" });

            const space = await hasSpace({ _id: spaceID }, manageError);
            if (!space) return;

            let { id } = data;
            if (!id) return manageError({ code: "invalid_data" });

            const { userID } = ids;

            const user = await hasUser({ _id: userID }, manageError);
            if (!user) return;

            if (!manageCheckUserHasPermissions(user, ["manage_users"])) return;

            id = stringService.removeSpacesAndLowerCase(id);

            const removeUser = await hasUser({ _id: id }, manageError);
            if (!removeUser) return;

            const hasExistentSpace = removeUser.spaces?.find((x: any) => String(x.id) == spaceID);
            if (!hasExistentSpace) return manageError({ code: "user_not_in_space" });

            const spaces = removeUser.spaces?.filter((x: any) => String(x.id) != spaceID);
        
            let spaceUserMetrics = space.metrics?.users || 0;

            await spaceModel.findByIdAndUpdate(space._id, { $set:{ metrics: { user: spaceUserMetrics - 1 } } }, { new: true });
            
            const removedUser  = await userModel.findByIdAndUpdate(removeUser._id, { $set:{ spaces, lastUpdate: Date.now() } }, { new: true }).select("-password");

            return removedUser;
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    updateSpaceRole: async ({ manageError, params, data, ids, manageCheckUserHasPermissions}: ManageRequestBody) => {
        try {
            const { spaceID, roleID } =  params;
            const { userID } =  ids;
            if (!spaceID || !roleID || !userID) return manageError({ code: "invalid_params" });

            const user = await hasUser({ _id: userID }, manageError);
            if (!user) return;
            
            const space = await hasSpace({ _id: spaceID }, manageError);

            if (!space) return;

            if (!manageCheckUserHasPermissions(user, ["manage_roles"])) return;
 
            const spaceRole = Array.isArray(space.roles) ? space.roles.find((x: any) => String(x._id) === roleID) : null;
            if (!spaceRole) return manageError({ code: "role_not_found" });

            if (spaceRole.system) return manageError({ code: "system_role_modification_forbidden" });

            let { name, permissions } = data;

            if (name) {
                name = stringService.removeSpacesAndLowerCase(name);
    
                if (name !== spaceRole.name) {
                    const hasExistentRole = Array.isArray(space.roles) ? space.roles.find((x: any) => x.name === name) : null;
                    if (hasExistentRole) return manageError({ code: "role_already_exists" });
                };
            };

            if (permissions) spaceRole.permissions = permissions;
            if (name) spaceRole.name = name;

            return await spaceModel.findByIdAndUpdate(spaceID, { $set: { roles: space.roles, lastUpdate: Date.now() } }, { new: true });          
        } catch (error) { 
            manageError({ code: "internal_error", error });
        }
    },
    getSpaceRole: async ({ manageError, params }: ManageRequestBody) => {
        try {
            const { spaceID, roleID } =  params;
            if (!spaceID || !roleID) return manageError({ code: "invalid_params" });

            const space = await hasSpace({ _id: spaceID }, manageError);
            if (!space) return;

            const spaceRole = Array.isArray(space.roles) ? space.roles.find((x: any) => String(x._id) === roleID) : null;
            if (!spaceRole) return manageError({ code: "role_not_found" });

            return spaceRole;
        } catch (error) { 
            manageError({ code: "internal_error", error });
        }
    },
    updateUserRole: async ({ manageError, params, data, ids, manageCheckUserHasPermissions }: ManageRequestBody) => {
        try {
            const { targetUserID, roleID } = data;
            const { spaceID } = params;
            const { userID } = ids;
            
            if (!spaceID || !roleID || !targetUserID) return manageError({ code: "invalid_params" });

            const user = await hasUser({ _id: userID }, manageError);
            if (!user) return;

            if (!manageCheckUserHasPermissions(user, ["manage_roles"])) return;

            const space = await hasSpace({ _id: spaceID }, manageError);
            if (!space) return;

            const spaceRole = Array.isArray(space.roles) ? space.roles.find((x: any) => String(x._id) === roleID) : null;
            if (!spaceRole) return manageError({ code: "role_not_found" });

            const targetUser = await hasUser({ _id: targetUserID }, manageError);
            if (!targetUser) return;

            const userSpace = targetUser.spaces?.find((x: any) => String(x.id) === spaceID);
            if (!userSpace) return manageError({ code: "user_not_in_space" });

            userSpace.role = new Types.ObjectId(roleID) as any;

            const updatedUser = await userModel.findByIdAndUpdate(
                targetUserID, 
                { $set: { spaces: targetUser.spaces, lastUpdate: Date.now() } }, 
                { new: true }
            ).select("-password");

            return {
                user: updatedUser,
                role: spaceRole
            };
        } catch (error) { 
            manageError({ code: "internal_error", error });
        }
    },
    deleteSpaceRole: async ({ manageError, params, ids, manageCheckUserHasPermissions }: ManageRequestBody) => {
        try {
            const { spaceID, roleID } =  params;
            if (!spaceID || !roleID) return manageError({ code: "invalid_params" });

            const space = await hasSpace({ _id: spaceID }, manageError);
            if (!space) return;

            const { userID } = ids;

            const user = await hasUser({ _id: userID }, manageError);
            if (!user) return;

            if (!manageCheckUserHasPermissions(user, ["manage_roles"])) return;

            const spaceRole = Array.isArray(space.roles) ? space.roles.find((x: any) => String(x._id) === roleID) : null;
            if (!spaceRole) return manageError({ code: "role_not_found" });
            
            const normalRole = Array.isArray(space.roles) ? space.roles.find((x: any) => x.name === "normal") : null;
            if (!normalRole) return manageError({ code: "role_not_found" });

            if (spaceRole.system) return manageError({ code: "system_role_modification_forbidden" });

            const usersWithSpace = await userModel.find({ "spaces.id": spaceID, "spaces.role": roleID });
            for (const spaceUser of usersWithSpace) {
                const userSpace = spaceUser.spaces.find((space) => String(space.id) === spaceID && String(space.role) === roleID);
                if (userSpace) {
                    userSpace.role = normalRole._id as any; 
                }
                await spaceUser.save();
            }
    
            const newRoles = Array.isArray(space.roles) ? space.roles.filter((x: any) => String(x._id) !== roleID) : null;
            return await spaceModel.findByIdAndUpdate(spaceID, { $set: { roles: newRoles, lastUpdate: Date.now() } }, { new: true });   
        } catch (error) { 
            manageError({ code: "internal_error", error });
        }
    },
    configSpaceModule: async ({ manageError, params, data, ids, manageCheckUserHasPermissions }: ManageRequestBody) => {
        try {
            const { spaceID, module } = params;
            if (!spaceID || !module) return manageError({ code: "invalid_params" });
    
            const space = await spaceModel.findById(spaceID);
            if (!space) return manageError({ code: "space_not_found" });
    
            if (!space.modules || !(module in space.modules)) {
                return manageError({ code: "invalid_params" });
            }
    
            const currentModule = space.modules[module as keyof typeof space.modules] as any;
            if (!currentModule) return manageError({ code: "invalid_params" });

            const { userID } = ids;

            const user = await hasUser({ _id: userID }, manageError);
            if (!user) return;

            if (!manageCheckUserHasPermissions(user, ["manage_modules"])) return;

            const { config } = data;

            currentModule.config = {...currentModule.config, ...config};
    
            currentModule.lastUpdate = new Date();
    
            space.markModified(`modules.${module}`);
            return await space.save();
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    }
};

export default spacesResource;