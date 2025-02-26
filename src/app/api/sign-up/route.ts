import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { UserModel } from "@/models/userModel";
import dbConnect from "@/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs"

export async function POST(req: NextRequest) {
    await dbConnect()

    try {
        const { fullName, email, username, password } = await req.json()

        console.log(fullName, email, username, password);

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

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
        const hashedPassword = await bcrypt.hash(password, 10);

        // checking if user exists with the email.
        const existedUserWithEmail = await UserModel.findOne({ email })

        if (existedUserWithEmail) {

            // checking if user exists with the email and also verified.
            if (existedUserWithEmail.isVerified) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "User exists with this email.",
                    },
                    { status: 400 }
                )
            }

            // checking if user exists with the email and user is not verified, so change user's data with the new given data.

            else {

                existedUserWithEmail.username = username;
                existedUserWithEmail.fullName = fullName;
                existedUserWithEmail.password = hashedPassword;
                existedUserWithEmail.verifyCode = verifyCode;
                existedUserWithEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);

                await existedUserWithEmail.save()

                await sendVerificationEmail(email, fullName, username, verifyCode)

                return NextResponse.json(
                    {
                        success: true,
                        message: "User data changed succesfully.",
                    },
                    { status: 200 }
                )
            }
        }

        // if user's username and email does not exists then simple this code wil create a new user.

        const user = await UserModel.create({
            fullName,
            email,
            username,
            password: hashedPassword,
            verifyCode,
            verifyCodeExpiry: new Date(Date.now() + 3600000),
            needsUsernameUpdate: false
        })

        await sendVerificationEmail(email, fullName, username, verifyCode)

        return NextResponse.json(
            {
                success: true,
                message: "User created successfully.",
                data: user
            },
            { status: 200 }
        )
    } catch (error) {

        console.log(error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed while registering a user.",
                error: error
            },
            { status: 500 }
        )
    }
}