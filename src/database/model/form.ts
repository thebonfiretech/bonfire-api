import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["text", "multiple-choice", "single-choice"],
        required: true,
    },
    answer: {
        type: [
            {
                text: {
                    type: String,
                    required: true,
                },
                id: String
            },
        ],
        default: [],
    }
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
    },
});

const formModel = mongoose.model("form", formSchema);

export default formModel;
