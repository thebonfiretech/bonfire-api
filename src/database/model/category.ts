import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
    },
    description: {
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
        required: true,
        ref: "user",
    },
    linked: {
        type: String,
    },
    type: {
        type: String,
        enum: ["product"],
    }
});

const categoryModel = mongoose.model("category", categorySchema);

export default categoryModel;
