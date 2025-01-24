import mongoose from "mongoose";

import { SpaceRolePermissionsValues } from "@utils/types/models/space";

const spaceSchema = new mongoose.Schema({
    name: String,
    owner: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        name: String
    }, 
    status: {
        enum: ["active", "inactive"],
        default: "active",
        type: String,
    },
    createAt: {
        default: Date.now(),
        type: Date,
    },
    lastUpdate: {
        type: Date,
    },
    description: {
        type: String
    },
    images: {
        profile: String
    },
    badges: [],
    metrics:{
        users: {
            type: Number,
            default: 0,
        }
    },
    roles: {
        type: [
            {
                name: String,
                system: {
                    type: Boolean,
                    default: false
                },
                createAt: {
                    default: Date.now(),
                    type: Date,
                },
                permissions: {
                    type: [String],
                    enum: SpaceRolePermissionsValues,
                }
            }
        ],
        default: []
    },
    coins: {
        type: Number,
        default: 0
    },
    modules:{
        "economy": {
            updateStatusAt: Date,
            lastUpdate: Date,
            moduleAlreadyUsed: {
                type: Boolean,
                default: false
            },
            status: {
                type: String,
                enum: ["active", "inactive"],
                default: "inactive",
            },
            systemConfig: {
                initialCoins: {
                    type: Number,
                    default: 5000
                },
                coinPerAddeduser: {
                    type: Number,
                    default: 25
                },
                investmentsSlots: {
                    type: Number,
                    default: 6
                }
            },
            config: {
                default: {}
            }
        }
    }
});

const spaceModel = mongoose.model("space", spaceSchema);

export default spaceModel;