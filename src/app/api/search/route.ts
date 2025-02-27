import { TweetModel } from "@/models/tweetModel";
import dbConnect from "@/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

    await dbConnect()

    try {

        const url = new URL(req.url)
        const query = url.searchParams.get("q")

        // Validate the query
        if (!query) {
            return NextResponse.json(
                {
                    success: false,
                    messge: "Query parameter is required"
                },
                {
                    status: 400
                }
            )
        }

        const searchResult = await TweetModel
        .find({ tags: query })
        .populate("user", "fullName username profilePicture")
        .lean()

        return NextResponse.json(
            {
                success: true,
                messge: "Query Result found.",
                searchResult
            },
            {
                status: 200
            }
        )

    } catch (error) {

        console.log(error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed while getting search query result.",
                error
            },
            { status: 500 }
        )
    }
}