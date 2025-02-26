import mongoose, { Document, model, Schema } from "mongoose";

export interface UserInterface extends Document {
    fullName: string;
    email: string;
    username: string;
    password?: string;
    profilePicture?: string;
    isVerified: boolean;
    verifyCode?: string;
    verifyCodeExpiry?: Date;
    forgotPasswordCode?: string;
    forgotPasswordCodeExpiry?: Date;
    followers: mongoose.Types.ObjectId[];
    following: mongoose.Types.ObjectId[];
    provider: string;
    tweets?: mongoose.Types.ObjectId[];
    needsUsernameUpdate: boolean;
}

export const userSchema: Schema<UserInterface> = new Schema({
    fullName: {
        type: String,
        required: [true, "fullName is required."],
    },
    email: {
        type: String,
        required: [true, "email is required."],
        unique: true,
        match: [
            /^(?=.{6,254}$)(?=.{1,64}@)[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
            "Email invalid!"
        ]
    },
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        trim: true
    },
    password: {
        type: String,
    },
    profilePicture: {
        type: String,
        default: "/assets/unknown-profile-picture.png"
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verifyCode: String,
    verifyCodeExpiry: Date,
    forgotPasswordCode: String,
    forgotPasswordCodeExpiry: Date,
    followers: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        default: [],
    },
    following: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        default: [],
    },
    provider: {
        type: String,
        default: "credentials"
    },
    needsUsernameUpdate: {
        type: Boolean,
        default: false
    },
    tweets: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Tweet",
        default: []
    }
}, { timestamps: true })

export const UserModel = (mongoose.models.User as mongoose.Model<UserInterface>) || (model<UserInterface>("User", userSchema))