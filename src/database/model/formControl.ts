import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["text", "multiple-choice", "single-choice"],
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    options: {
        type: [
            {
                text: {
                    type: String,
                    required: true,
                },
            },
        ],
        default: [],
    },
    required: {
        type: Boolean,
        default: false,
    },
});

const formControlSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String,
        unique: true,
    },
    user: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
        avatar: String,
        name: String,
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
    },
    createAt: {
        type: Date,
        default: Date.now(),
    },
    lastUpdate: {
        type: Date,
    },
    description: {
        type: String,
    },
    images: {
        banner: String,
    },
    authenticationRequired: {
        type: Boolean,
        default: false,
    },
    singleShipping: {
        type: Boolean,
        default: false,
    },
    shuffle: {
        type: Boolean,
        default: false,
    },
    collectEmail: {
        type: Boolean,
        default: true,
    },
    questions: {
        type: [questionSchema],
        default: [],
    },
});

const formControlModel = mongoose.model("form-control", formControlSchema);

export default formControlModel;
