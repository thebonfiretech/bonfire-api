import mongoose from "mongoose";

const keySchema = new mongoose.Schema({
    name: {
        required: true,
        type: String,
        unique: true,
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
    keyType: {
        type: String,
        enum: ["pix", "favorite"],
        required: true
    },
    slotType: {
        type: String,
        enum: ["normal", "special"],
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user"
    }
});

const keyModel = mongoose.model("key", keySchema);

export default keyModel;
