import mongoose from "mongoose";

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
    }
});

const spaceModel = mongoose.model("space", spaceSchema);

export default spaceModel;