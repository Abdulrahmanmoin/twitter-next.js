"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTrigger,
} from "@/components/ui/dialog"
import { MoreHorizontal } from "lucide-react"
import FileUpload from "./FileUpload";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { signOut, useSession } from "next-auth/react";
import { Separator } from "./ui/separator";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { useToast } from "@/hooks/use-toast";

interface MoreOptionsDialogButtonProps {
    isSideNavigator?: boolean
}

export function MoreOptionsDialogButton({ isSideNavigator = false }: MoreOptionsDialogButtonProps) {

    const { update } = useSession();
    const { toast } = useToast()


    const handleProfileUploadSucess = async (res: IKUploadResponse) => {
        try {

            const response = await axios.post("/api/upload-profil-picture", { imageUrl: res.url })

            await update({ profilePicture: response.data.user.profilePicture })

            toast({
                title: "Profile picture updated successfully.",
            })

        } catch (error) {
            console.error(error);

            const axiosError = error as AxiosError<ApiResponse> || ""
            toast({
                title: "Failed to upload profile picture.",
                description: axiosError.response?.data.message || "Please try again.",
                variant: "destructive"
            })
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                {isSideNavigator ?
                    (
                        <Button
                            variant="ghost"
                            className="w-full justify-center xl:justify-start space-x-4 p-3 hover:bg-gray-900 rounded-full text-xl"
                        >
                            <MoreHorizontal className="h-6 w-6" />
                            <span className="hidden xl:block">More</span>
                        </Button>
                    ) :
                    (
                        <Button variant="outline" size="icon" className="rounded-full">
                            <MoreHorizontal
                                className="h-5 w-5"
                            />
                        </Button>
                    )
                }
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogDescription className="text-lg text-white font-bold text-center underline pb-5">More Options</DialogDescription>
                    <DialogDescription
                        className="text-sm text-white font-bold"
                    >
                        Change your profile picture:
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                    <div className="grid flex-1">
                        <FileUpload
                            onSuccess={handleProfileUploadSucess}
                        />
                    </div>
                </div>
                <Separator className="bg-white my-4 " />
                <div className="flex items-center space-x-2">
                    <div className="grid flex-1">
                        <Button
                            onClick={() => signOut()}
                            className="w-auto bg-white text-black hover:bg-white hover:text-black"
                        >Logout</Button>
                    </div>
                </div>
                <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                        <Button
                            type="button"
                            variant="secondary"
                            className="mt-6 mb-1"
                        >
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
