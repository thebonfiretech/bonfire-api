import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
    createAt: {
        default: Date.now(),
        type: Date,
    },
    date: {
        type: Date,
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user"
    },
    spaceID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "space"
    },
    meals: {
        type: [{
            items: [String],
            time: String,
            _id: false,
        }],
        default: []
    }
});

const foodModel = mongoose.model("food", foodSchema);

export default foodModel;
