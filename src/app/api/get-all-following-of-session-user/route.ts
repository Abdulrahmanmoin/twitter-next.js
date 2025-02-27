import dbConnect from "@/utils/dbConnect";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
import { UserModel } from "@/models/userModel";

export async function GET() {

    await dbConnect()

    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                {
                    success: false,
                    message: `Not authenticated.`
                },
                {
                    status: 401
                }
            )
        }

        const dbUser = await UserModel.findOne({ _id: new mongoose.Types.ObjectId(session?.user._id) })
            .select("following")
            .populate("following", "username")
            .lean()

        if (!dbUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: `User not found.`
                },
                {
                    status: 404
                }
            )
        }

        return NextResponse.json(
            {
                success: true,
                message: "User following list with username is here.",
                user: dbUser
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
                message: "Failed while fetching a following list.",
                error: error
            },
            { status: 500 }
        )
    }

}