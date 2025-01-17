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
        enum: ["buy", "pix", "other"],
        required: true
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user"
    },
    fromID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }
});

const transactionModel = mongoose.model("transaction", transactionSchema);

export default transactionModel;
