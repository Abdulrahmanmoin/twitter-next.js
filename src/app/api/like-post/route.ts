import dbConnect from "@/utils/dbConnect";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
import { TweetModel } from "@/models/tweetModel";

export async function POST(req: NextRequest) {

    await dbConnect()

    try {
        const { tweetId } = await req.json()

        const session = await getServerSession(authOptions);

        if (!session || !session.user?._id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Not authenticated.",
                },
                { status: 401 }
            );
        }

        // The tweet who got the like from the user
        const tweetWhoGotLike = await TweetModel.findByIdAndUpdate(
            { _id: tweetId },
            { $addToSet: { likesBy: new mongoose.Types.ObjectId(session?.user._id) } },
            { new: true }
        )

        // if the tweet not found.
        if (!tweetWhoGotLike) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Tweet not found with this tweet id."
                },
                {
                    status: 404
                }
            )
        }

        return NextResponse.json(
            {
                success: true,
                message: "Post liked successfully."
            },
            {
                status: 201
            }
        )

    } catch (error) {

        console.log(error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed while liking a post.",
                error: error
            },
            { status: 500 }
        )
    }

}