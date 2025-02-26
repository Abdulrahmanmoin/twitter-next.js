import dbConnect from "@/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { TweetModel } from "@/models/tweetModel";
import { UserModel } from "@/models/userModel";

export async function POST(req: NextRequest) {

    await dbConnect()

    try {

        const { username } = await req.json()

        const user = await UserModel.findOne({ username })

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found."
                },
                { status: 404 }
            )
        }

        const tweets = await TweetModel.find({ user: user._id })
            .sort({ createdAt: -1 })
            .populate("user", "name username profileImage")
            .select("content tags createdAt media likes retweets retweetsAmount")
            .lean()

        if (!tweets) {
            return NextResponse.json(
                {
                    success: false,
                    message: "No tweets yet."
                },
                { status: 404 }
            )
        }

        if (tweets.length === 0) {
            return NextResponse.json(
                {
                    success: true,
                    message: "No tweets yet."
                },
                { status: 201 }
            )
        }

        return NextResponse.json(
            {
                success: true,
                tweets
            },
            { status: 200 }
        )

    } catch (error) {

        console.log(error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed while getting tweets.",
                error: error
            },
            { status: 500 }
        )
    }

}