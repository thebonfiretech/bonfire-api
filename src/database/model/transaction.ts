import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
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
    type: {
        type: String,
        enum: ["buy", "pix", "other", "investment"],
        required: true
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user"
    },
    value:{
        type: Number
    },
    fromID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    toID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    items: {
        type: mongoose.Schema.Types.Mixed,
    },
});

const transactionModel = mongoose.model("transaction", transactionSchema);

export default transactionModel;
