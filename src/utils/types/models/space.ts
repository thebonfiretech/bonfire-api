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
    badges?: any[];
    metrics?: {
        users: number;
    };
}
