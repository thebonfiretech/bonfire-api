export interface UserSpaceType {
    entryAt?: Date;
    role: "normal" | "editor" | "admin" | "owner";
    name: string;
    id: string;
};

export interface UserModelType {
    _id: string;
    id: string;
    order?: number;
    name: string;
    role: "normal" | "admin";
    status: "loggedIn" | "registered" | "blocked";
    createAt?: Date;
    lastUpdate?: Date;
    firstSignup?: Date;
    lastGetUser?: Date;
    spaces?: UserSpaceType[];
    description?: string;
    images?: {
        profile?: string;
    };
    badges?: any[];
    coins?: number;
    password?: string;
    email?: string;
    keys: {
        slots: number;
        specialSlots: number;
        favoriteSlots: number;
    };
};