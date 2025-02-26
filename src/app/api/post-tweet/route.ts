import dbConnect from "@/utils/dbConnect";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import { TweetModel } from "@/models/tweetModel";
import mongoose from "mongoose";
import { UserModel } from "@/models/userModel";

export async function POST(req: NextRequest) {

    await dbConnect()

    try {
        const session = await getServerSession(authOptions)

        const user = session?.user

        if (!session || !user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Not authenticated"
                },
                {
                    status: 400
                }
            )
        }

        const body = await req.json();
        const content = body.content; // required field
        const media = body.media ? body.media : ""; // if media exists, use it; otherwise, default to []

        // Extract hashtags from content
        const tags = content.match(/#\w+/g) || []; // Matches words starting with #
        const cleanedTags = tags.map((tag: string) => tag.replace("#", "").toLowerCase()); // Remove #


        const tweet = await TweetModel.create(
            {
                user: new mongoose.Types.ObjectId(user._id),
                content,
                media: media ? media : undefined,
                tags: cleanedTags
            }
        )

        // Checking if user with this session.user id exists or not
        const existingUser = await UserModel.findById(user._id);

        if (!existingUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found in the database."
                },
                { status: 404 }
            );
        }

        let updatedUser;

        if (tweet) {
            updatedUser = await UserModel.findByIdAndUpdate(
                new mongoose.Types.ObjectId(user._id),
                { $push: { tweets: tweet._id } },
                { new: true }
            )
        }

        return NextResponse.json(
            {
                success: true,
                message: "Tweet posted successfully.",
                data: { tweet, updatedUser }
            },
            { status: 200 }
        )

    } catch (error) {

        console.log(error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed while posting a tweet.",
                error: error
            },
            { status: 500 }
        )
    }

}