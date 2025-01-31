import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    status: {
        enum: ["active", "inactive"],
        default: "active",
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    lastUpdate: {
        type: Date,
        default: Date.now,
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    url: {
        type: String
    },
    id: {
        type: String,
    },
    scope: {
        type: String,
        enum: ["general"],
        default: "general"
    }
});

const fileModel = mongoose.model("file", fileSchema);

export default fileModel;
