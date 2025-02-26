import dbConnect from "@/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { UserModel } from "@/models/userModel";

export async function POST(req: NextRequest) {
    await dbConnect()

    try {

        const body = await req.json()

        const { userId } = body;

        let user;
        if (userId) {

            user = await UserModel.findById(new mongoose.Types.ObjectId(userId))
        } else {
            const { username } = body;

            user = await UserModel.findOne({ username })
            
        }


        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found."
                },
                { status: 404 }
            )
        }

        return NextResponse.json(
            {
                success: true,
                user
            },
            { status: 200 }
        )
    } catch (error) {

        console.log("error: ", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed while getting user's data."
            },
            { status: 500 }
        )
    }
}