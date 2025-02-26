import dbConnect from "@/utils/dbConnect";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import { TweetModel } from "@/models/tweetModel";

export async function GET() {

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

        const tweets = await TweetModel.find()
            .sort({ createdAt: -1 })
            .populate("user", "username profilePicture fullName")
            .select("content tags createdAt media likes _id")
            .lean()

        if (!tweets || tweets.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "No tweets yet."
                },
                { status: 404 }
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