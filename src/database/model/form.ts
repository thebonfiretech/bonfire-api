import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["text", "multiple-choice", "single-choice"],
        required: true,
    },
    id: String,
    answer: {
        type: [
            {
                text: {
                    type: String,
                },
                id: String
            },
        ],
        default: [],
        _id: false,
    },
});

const formSchema = new mongoose.Schema({
    formControlID: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: "form-control",
    },
    submittedAt: {
        type: Date,
        default: Date.now(),
    },
    user: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
        avatar: String,
        name: String,
        email: String
    },
    answers: {
        type: [answerSchema],
        default: [],
        _id: false
    },
});

const formModel = mongoose.model("form", formSchema);

export default formModel;
