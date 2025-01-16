import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    space: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "space"
        },
        name: String
    }, 
    creator: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        avatar: String,
        name: String
    }, 
    class: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "class"
        },
        name: String
    }, 
    role: {
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
    attachments: {
        type: [String],
        default: []
    },
    type: {
        type: String,
        enum: ["default", "report", "warn"],
        default: "default"
    },
    scope: {
        type: String,
        enum: ["all", "space", "class", "role", "administrators"],
        default: "all"
    },
});

const postModel = mongoose.model("post", postSchema);

export default postModel;