import mongoose from "mongoose";

const keySchema = new mongoose.Schema({
    name: String,
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
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }
});

const keyModel = mongoose.model("key", keySchema);

export default keyModel;
