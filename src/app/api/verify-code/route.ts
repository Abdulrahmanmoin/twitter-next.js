import { UserModel } from "@/models/userModel";
import dbConnect from "@/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { verifyCodeSchema } from "@/zodSchemas/verifyCodeSchema";

export async function POST(req: NextRequest) {

    await dbConnect()

    try {

        const { username, code } = await req.json()

        const zodResult = verifyCodeSchema.safeParse(code)

        if (!zodResult.success) {

            const codeErrors = zodResult.error.format()?._errors || []

            return NextResponse.json(
                {
                    success: false,
                    message: codeErrors.length > 0 ? codeErrors.join(", ") : "Invalid Verification code."
                },
                { status: 401 }
            )

        }

        const user = await UserModel.findOne({ username })

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found."
                },
                { status: 404 }
            )
        }

        const isCodeWrong = user.verifyCode !== code;
        const isCodeExpire = user.verifyCodeExpiry ? (new Date(user.verifyCodeExpiry) < new Date()) : true;

        if (isCodeWrong) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Wrong verification code."
                },
                { status: 404 }
            )
        }

        if (isCodeExpire) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Verification code is expired."
                },
                { status: 401 }
            )
        }

        if (!isCodeExpire && !isCodeWrong) {
            user.isVerified = true
            await user.save()

            return NextResponse.json(
                {
                    success: true,
                    message: "User verified successfully.",
                    data: user
                },
                { status: 200 }
            )
        }

    } catch (error) {

        console.log(error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed while verifying a user.",
                error: error
            },
            { status: 500 }
        )
    }

}   