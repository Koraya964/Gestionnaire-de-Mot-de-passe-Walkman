import mongoose from "mongoose";

const passwordSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User ID requis"],
        index: true
    },

    title: {
        type: String,
        required: true,
        max: 30
    },

    website: {
        type: String,
        required: true,
        max: 255
    },

    email: {
        type: String,
        max: 45
    },

    userName: {
        type: String,
        max: 30
    },

    category: {
        type: String,
        enum: {
            values: ["social", "banking", "email", "shopping", "work", "other"],
            message: "Catégorie invalide"
        },
        default: "other"
    },

    encryptedPassword: {
        type: String,
        required: true
    },

    iv: {
        type: String,
        required: true
    },

    authTag: {
        type: String,
        required: true
    }

}, { timestamps: true });

const Password = mongoose.model("Password", passwordSchema);
export default Password;
