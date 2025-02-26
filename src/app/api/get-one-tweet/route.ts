import dbConnect from "@/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { TweetModel } from "@/models/tweetModel";

export async function POST(req: NextRequest) {

    await dbConnect()

    try {
        const { tweetId } = await req.json()


        // The tweet whose ID will get match
        const tweet = await TweetModel.findById(tweetId)

        // if the tweet not found.
        if (!tweet) {
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
                message: "Tweet found successfully.",
                tweet
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
                message: "Failed while getting a tweet by tweet ID.",
                error: error
            },
            { status: 500 }
        )
    }

}