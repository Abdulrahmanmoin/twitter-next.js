import { UserModel } from "@/models/userModel";
import dbConnect from "@/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {

    await dbConnect()

    try {
        const { username } = await req.json()
        
        const session = await getServerSession(authOptions)
        const user = session?.user

        if (!session || !user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Not authenticated."
                },
                { status: 404 }
            )
        }

        const userFromDb = await UserModel.findById(new mongoose.Types.ObjectId(user._id))

        if (!userFromDb) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found."
                },
                { status: 404 }
            )
        }

        userFromDb.username = username;
        userFromDb.needsUsernameUpdate = false;
        await userFromDb.save();

        return NextResponse.json(
            {
                success: true,
                message: "Username updated successfully."
            },
            { status: 200 }
        )

    } catch (error) {

        console.log(error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed while setting a username for google provider.",
                error: error
            },
            { status: 500 }
        )
    }
}