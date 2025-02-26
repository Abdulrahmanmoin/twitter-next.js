import { UserModel } from "@/models/userModel";
import dbConnect from "@/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { sendForgotPasswordEmail } from "@/helpers/sendForgotPasswordEmail";

export async function POST(req: NextRequest) {

    await dbConnect()

    try {

        const { email } = await req.json()

        const user = await UserModel.findOne({ email });

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found."
                },
                {
                    status: 404
                }
            )
        }

        if (user.provider !== "credentials") {
            return NextResponse.json(
                {
                    success: false,
                    message: "User is not registered with email and password. Please login with google."
                },
                {
                    status: 401
                }
            )
        }

        const forgotPasswordCode = Math.floor(100000 + Math.random() * 900000).toString()

        if (!user.isVerified) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Please verify your account before login!"
                },
                {
                    status: 401
                }
            )
        } else {
            user.forgotPasswordCode = forgotPasswordCode;
            user.forgotPasswordCodeExpiry = new Date(Date.now() + 3600000);
            await user.save()

            await sendForgotPasswordEmail(user.email, user.fullName, user.username, user.forgotPasswordCode)

            return NextResponse.json(
                {
                    success: true,
                    message: "Email sent successfully!"
                },
                {
                    status: 200
                }
            )
        }

    } catch (error) {

        console.log(error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed while sending reset password email.",
                error: error
            },
            { status: 500 }
        )
    }

}