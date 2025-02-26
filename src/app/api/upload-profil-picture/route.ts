import dbConnect from "@/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { UserModel } from "@/models/userModel";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(req: NextRequest) {
    await dbConnect()

    try {

        const { imageUrl } = await req.json()

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

        const dbUser = await UserModel.findByIdAndUpdate(
            { _id: user._id },
            { profilePicture: imageUrl },
            { new: true }
        )

        return NextResponse.json(
            {
                success: true,
                user: dbUser
            },
            { status: 200 }
        )
    } catch (error) {

        console.log("error: ", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed while changing user's profile picture."
            },
            { status: 500 }
        )
    }
}