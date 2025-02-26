import dbConnect from "@/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function DELETE(req: NextRequest) {
    await dbConnect()

    try {

        const fileId = await req.nextUrl.searchParams.get("fileId")

        if (!fileId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "fileId is required"
                },
                { status: 400 }
            );
        }

        const response = await axios.delete(`https://api.imagekit.io/v1/files/${fileId}`, {
            headers: {
                Accept: 'application/json',
                Authorization: `Basic ${btoa(process.env.PRIVATE_KEY + ":")}`
            }
        })

        if (response.status !== 204) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Error while deleting a file",
                    response
                },
                { status: 401 }
            )
        }


        return NextResponse.json(
            {
                success: true,
                message: "File Deleted Succesfully."
            },
            { status: 200 }
        )

    } catch (error) {

        console.log("error: ", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed while deleting a file from ImageKit."
            },
            { status: 500 }
        )
    }
}