import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    spaceID: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "space"
        },
        name: String
    }, 
    classID: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "class"
        },
        name: String
    }, 
    roleID: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "class"
        },
        name: String
    }, 
    createAt: {
        default: Date.now(),
        type: Date,
    },
    lastUpdate: {
        type: Date,
    },
    content: {
        type: String
    },
    title: {
        type: String
    },
    images: {
        profile: String
    },
    type: {
        type: String,
        enum: ["default", "report", "warn"],
        default: "default"
    },
    scope: {
        type: String,
        enum: ["all", "space", "class", "role", "administrators"]
    },
});

const postModel = mongoose.model("post", postSchema);

export default postModel;