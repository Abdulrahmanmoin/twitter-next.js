import mongoose, { Document, model, models, Schema } from "mongoose";

export interface TweetInterface extends Document {
    user: mongoose.Types.ObjectId;
    content: string;
    media?: string;
    tags?: string[];
    likesBy?: mongoose.Types.ObjectId[];
}

export const tweetSchema: Schema<TweetInterface> = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User must be required."]
    },
    content: {
        type: String,
        required: [true, "Tweet content is required."]
    },
    media: {
        type: String,
        default: ""
    },
    tags: {
        type: [String],
        default: []
    },
    likesBy: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        default: []
    }
}, { timestamps: true })

export const TweetModel = (models.Tweet as mongoose.Model<TweetInterface>) || (model<TweetInterface>("Tweet", tweetSchema))