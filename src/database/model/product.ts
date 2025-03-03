import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    description: {
        type: String,
    },
    value: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    lastUpdate: {
        type: Date,
        default: Date.now,
    },
    status: {
        enum: ["active", "inactive", "exhausted"],
        default: "active",
        type: String,
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user",
    },
    spaceID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "space",
    },
    metrics: {
        sold: {
            type: Number,
            default: 0
        },
        available: {
            type: Number,
            default: 0
        },
        views: {
            type: Number,
            default: 0
        }
    },
    attachments: {
        type: [String],
        default: []
    }
});

const productModel = mongoose.model("product", productSchema);

export default productModel;
