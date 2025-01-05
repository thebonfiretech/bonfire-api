import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    id: {
        unique: true,
        type: String
    },
    order: Number,
    name: String,
    role: {
        enum: ["normal", "admin"],
        default: "normal",
        type: String,
    },
    status: {
        enum: ["loggedIn", "registered", "blocked"],
        default: "registered",
        type: String,
    },
    createAt: {
        default: Date.now(),
        type: Date,
    },
    lastUpdate: {
        type: Date,
    },
    firstSignup: {
        type: Date,
    },
    lastGetUser: {
        type: Date,
    },
    spaces: [{
        entryAt: Date,
        role: {
            type: String,
            enum: ["normal", "editor", "admin"],
            default: "normal"
        },
        name: String,
        id: String 
    }],
    description: {
        type: String
    },
    images: {
        profile: String
    },
    badges: [],
    coins: {
        type: Number,
        default: 0
    },
    password: {
        type: String
    },
    email: {
        type: String
    },
    keys: {
        slots: {
            type: Number,
            default: 1
        },
        specialSlots: {
            type: Number,
            default: 0
        },
        favoriteSlots: {
            type: Number,
            default: 3
        }
    }
});

const userModel = mongoose.model("user", userSchema);

export default userModel;