import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
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
    type: {
        type: String,
        enum: ["suggestion", "report", "feedback", "other"],
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user"
    },
    messages: {
        type: [{
            content: String,
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user"
            },
            date: {
                default: Date.now(),
                type: Date
            }
        }],
        default: []
    },
    attachments: {
        type: [String],
        default: []
    }
});

const ticketModel = mongoose.model("ticket", ticketSchema);

export default ticketModel;
