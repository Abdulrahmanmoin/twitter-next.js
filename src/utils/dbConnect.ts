import { DB_NAME } from "@/constants";
import mongoose from "mongoose";
import { UserModel } from "@/models/userModel";
import { TweetModel } from "@/models/tweetModel";

interface ConnectionObject {
    isConnection?: number
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void> {
    if (connection.isConnection) {
        return
    }

    try {
        const db = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}${process.env.MONGO_URI_PARAMETERS}` || "")

        connection.isConnection = db.connections[0].readyState

        UserModel;
        TweetModel;

    } catch (error) {
        console.log("DB Connection failed: ", error);
        process.exit(1)
    }
}

export default dbConnect;