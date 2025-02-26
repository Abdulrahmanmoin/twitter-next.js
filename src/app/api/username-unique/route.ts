import { UserModel } from "@/models/userModel";
import dbConnect from "@/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { usernameSchema } from "@/zodSchemas/signUpSchema";

export async function POST(req: NextRequest) {

    await dbConnect()

    try {

        const { username } = await req.json()

        const result = usernameSchema.safeParse(username)

        if (!result.success) {
            const codeErrors = result.error.format()?._errors || []

            return NextResponse.json(
                {
                    success: false,
                    message: codeErrors.length > 0 ? codeErrors.join(", ") : "Invalid username"
                }, { status: 401 }
            )
        }

        // checking if user exists with the username and if exists then check the user with this username must be verified.
        const existedUserWithUsernameAndVerified = await UserModel.findOne({ username, isVerified: true })

        if (existedUserWithUsernameAndVerified) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Username is already taken.",
                },
                { status: 400 }
            )
        }

        return NextResponse.json(
            {
                success: true,
                message: "Username is available.",
            },
            { status: 200 }
        )

    } catch (error) {

        console.log(error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed while checking a uniqueness of username.",
                error: error
            },
            { status: 500 }
        )
    }
}