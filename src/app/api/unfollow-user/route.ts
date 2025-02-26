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

        if (!username || typeof username !== "string") {
            return NextResponse.json(
              {
                success: false,
                message: "Username is required and must be a string.",
              },
              { status: 400 }
            );
        }

        const session = await getServerSession(authOptions);

        if (!session || !session.user?._id) {
            return NextResponse.json(
              {
                success: false,
                message: "Not authenticated.",
              },
              { status: 401 }
            );
          }


        const userWhoGotUnfollow = await UserModel.findOneAndUpdate(
            { username },
            { $pull: { followers: new mongoose.Types.ObjectId(session?.user._id) } },
            { new: true }
        )

        if (!userWhoGotUnfollow) {
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

        const userWhoUnfollow = await UserModel.findByIdAndUpdate(
            new mongoose.Types.ObjectId(session?.user._id),
            { $pull: { following: userWhoGotUnfollow._id } },
            { new: true }
        )

        if (!userWhoUnfollow) {
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
                message: `User unfollowed "${userWhoGotUnfollow.username}" succesfully.`
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