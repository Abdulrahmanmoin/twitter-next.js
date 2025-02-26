import dbConnect from "@/utils/dbConnect";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
import { UserModel } from "@/models/userModel";

export async function POST(req: NextRequest) {

    await dbConnect()

    try {
        const { username } = await req.json()

        const session = await getServerSession(authOptions);

        const userWhoGotFollow = await UserModel.findOneAndUpdate(
            { username },
            { $push: { followers: new mongoose.Types.ObjectId(session?.user._id) } },
            { new: true }
        )

        if (!userWhoGotFollow) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found with this username."
                },
                {
                    status: 404
                }
            )
        }

        const userWhoFollow = await UserModel.findByIdAndUpdate(
            new mongoose.Types.ObjectId(session?.user._id),
            { $push: { following: userWhoGotFollow._id } },
            { new: true }
        )

        if (!userWhoFollow) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found with the session's user."
                },
                {
                    status: 404
                }
            )
        }

        return NextResponse.json(
            {
                success: true,
                message: `User followed ${userWhoGotFollow.username} succesfully.`
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
                message: "Failed while following a user.",
                error: error
            },
            { status: 500 }
        )
    }

}