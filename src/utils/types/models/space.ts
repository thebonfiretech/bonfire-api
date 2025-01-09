export const SpaceRolePermissionsValues = [
    "administrator", 
    "manage_space",
    "manage_roles",
    "manage_users",
    "manage_coins",
    "owner", 
] as const;

export type SpaceRolePermissions = typeof SpaceRolePermissionsValues[number];

export interface SpaceRoleType {
    permissions: SpaceRolePermissions[];
    system: boolean;
    createAt?: Date;
    name: string;
};

export interface SpaceModelType {
    _id: string;
    name: string;
    status: "active" | "inactive";
    createAt?: Date;
    lastUpdate?: Date;
    description?: string;
    images?: {
        profile?: string;
    };
    owner: {
        id: string;
        name: string
    };
    badges?: any[];
    metrics?: {
        users: number;
    };
    roles: SpaceRoleType,
    coins: number;
    modules: {
        economy: {
            updateStatusAt?: Date;
            lastUpdate?: Date;
            moduleAlreadyUsed: boolean;
            status: "active" | "inactive";
            systemConfig: {
                initialCoins: number;
                coinPerAddeduser: number;
            };
            config: {}
        };
    };
};