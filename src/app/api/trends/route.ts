import { TweetModel } from "@/models/tweetModel";
import dbConnect from "@/utils/dbConnect";
import { NextResponse } from "next/server";

export async function GET() {

    await dbConnect()

    try {

        const trends = await TweetModel.aggregate([
            { $unwind: "$tags" },
            { $group: { _id: "$tags", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ])


        if (!trends) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Failed while getting trends.",
                },
                { status: 404 }
            )
        }

        if (trends.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "No trends yet.",
                },
                { status: 204 }
            )
        }

        return NextResponse.json(
            {
                success: true,
                message: "Top 10 trends fetched successfully.",
                trends
            },
            { status: 200 }
        )

    } catch (error) {

        console.log(error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed while getting trends.",
                error
            },
            { status: 500 }
        )
    }
}