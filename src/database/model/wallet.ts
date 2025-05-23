import mongoose from "mongoose";

const walletSchema = new mongoose.Schema({
    name: {
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
    spaceID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "space",
    },
    investmentID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "investment",
    },
    availableValue: {
        type: Number,
        default:  0
    },
    yielding:[{
        value: {
            type: Number,
            default: 0,
        },
        addeAt: {
            type: Date,
            default: Date.now,
        }
    }],
    logs: [{
        description: String,
        date: {
            type: Date,
            default: Date.now,
        }
    }]
});

const walletModel = mongoose.model("wallet", walletSchema);

export default walletModel;
