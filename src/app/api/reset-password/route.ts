import { UserModel } from "@/models/userModel";
import dbConnect from "@/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { verifyCodeSchema } from "@/zodSchemas/verifyCodeSchema";
import bcrypt from "bcryptjs"

export async function POST(req: NextRequest) {

    await dbConnect()

    try {

        const { username, code, newPassword } = await req.json()

        const zodResult = verifyCodeSchema.safeParse(code)

        if (!zodResult.success) {

            const codeErrors = zodResult.error.format()?._errors || []

            return NextResponse.json(
                {
                    success: false,
                    message: codeErrors.length > 0 ? codeErrors.join(", ") : "Invalid Reset Password Code."
                },
                {
                    status: 401
                }
            )
        }

        const user = await UserModel.findOne({ username })

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

        const isCodeCorrect = user.forgotPasswordCode == code
        const isCodeNotExpire = user.forgotPasswordCodeExpiry ? new Date(user.forgotPasswordCodeExpiry) > new Date() : false;
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        if (isCodeCorrect && isCodeNotExpire) {

            user.password = hashedPassword;

            await user.save();

            return NextResponse.json(
                {
                    success: true,
                    message: "Password Updated Successfully."
                },
                {
                    status: 200
                }
            )
        } else if (!isCodeCorrect) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Reset Password Code Is Not Correct."
                },
                {
                    status: 401
                }
            )
        } else if (!isCodeNotExpire) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Reset Password Code Is Expired."
                },
                {
                    status: 401
                }
            )
        } 


    } catch (error) {

        console.log(error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed while resetting a password.",
                error: error
            },
            { status: 500 }
        )
    }

}