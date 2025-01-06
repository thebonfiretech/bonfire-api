export const SpaceRolePermissionsValues = [
    "administrator", 
    "space_edit",
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
    roles: SpaceRoleType
};