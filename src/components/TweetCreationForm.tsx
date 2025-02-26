"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props"
import FileUpload from "./FileUpload"
import { tweetSchema } from "@/zodSchemas/tweetSchema"
import { useEffect, useState } from "react"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { X } from "lucide-react"
import { useRouter } from "next/navigation"
import RefinePost from "./RefinePost"
import { IKImage } from "imagekitio-next"
import { IMAGEKIT_URL_ENDPOINT } from "@/constants"

export function TweetCreationForm() {

    const [mediaUrl, setMediaUrl] = useState<string>('')
    const [mediaFileId, setMediaFileId] = useState<string>('')
    const [mediaType, setMediaType] = useState<"image" | "video" | null>(null)
    const [remainingCharacters, setRemainingCharacters] = useState(280)

    const { data: session } = useSession()

    const { toast } = useToast()
    const router = useRouter()

    const form = useForm<z.infer<typeof tweetSchema>>({
        resolver: zodResolver(tweetSchema),
        defaultValues: {
            content: ""
        },
    })

    const handleTweetMediaUploadSuccess = async (res: IKUploadResponse, field: "image" | "video") => {

        setMediaFileId(res.fileId)
        setMediaUrl(res.url);
        setMediaType(field);

        toast({
            title: `${field === "image" ? "Image" : "Video"} uploaded successfully.`,
        });
    }

    async function onSubmit(data: z.infer<typeof tweetSchema>) {
        try {

            const response = await axios.post("/api/post-tweet", { content: data.content, media: mediaUrl || undefined })
            router.push("/")

            toast({
                title: "You submitted the following values:",
                description: response.data.message || ""
            })

            setMediaUrl("");
            setMediaType(null);

        } catch (error) {
            console.error(error);
            toast({
                title: "Failed to post tweet.",
                description: "Please try again.",
                variant: "destructive",
            });
        }
    }

    const MAX_CHARACTERS = 280
    const { control } = form;
    // Use useWatch to monitor changes on the content field
    const tweetContent = useWatch({ control, name: "content" });

    useEffect(() => {
        setRemainingCharacters(MAX_CHARACTERS - tweetContent.length);
    }, [tweetContent]);

    // Compute whether content is over the limit directly
    const isOverLimit = remainingCharacters < 0;

    const handleDeleteFile = async () => {
        try {
            await axios.delete(`/api/delete-imagekit-file?fileId=${mediaFileId}`)
            setMediaUrl("")
        } catch (error) {
            console.error("Error deleting file:", error);
        }
    }

    //  update the content of textarea with AI content
    const updateContent = (refinedText: string) => {
        form.setValue("content", refinedText, { shouldValidate: true })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="">

                <div className="flex items-start space-x-4 p-4">

                    <Image
                        src={session?.user?.profilePicture ?? ""}
                        alt="Avatar"
                        width={1000}
                        height={1000}
                        className="rounded-full w-10 h-10"
                    />

                    <div className="flex-1 min-w-0">
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea
                                            placeholder="What's happening?"
                                            className="min-h-[120px] w-full resize-none bg-transparent border-none text-xl placeholder-gray-500 focus:ring-0"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {mediaUrl && (mediaType === "image") && (
                            <div className="relative mt-2 rounded-2xl overflow-hidden">
                                {/* <img
                                    src={mediaUrl}
                                    alt="Uploaded"
                                    className="max-h-80 w-full object-cover"
                                /> */}
                                <IKImage
                                    urlEndpoint={IMAGEKIT_URL_ENDPOINT}
                                    src={mediaUrl}
                                    width={1000}
                                    height={1000}
                                    alt="Uploaded"
                                    className="max-h-80 w-full object-cover"
                                />
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="icon"
                                    className="absolute top-2 left-2 rounded-full bg-black/50 hover:bg-black/75"
                                    onClick={handleDeleteFile}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                        {mediaType === "video" && (
                            <div className="relative mt-2 rounded-2xl overflow-hidden">
                                <video
                                    src={mediaUrl}
                                    controls
                                    className="max-h-80 w-full object-cover"
                                />
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="icon"
                                    className="absolute top-2 left-2 rounded-full bg-black/50 hover:bg-black/75"
                                    onClick={handleDeleteFile}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        )}

                        <RefinePost
                            isButtonDisabled={tweetContent.length === 0 || isOverLimit}
                            rawContent={tweetContent}
                            updateContent={updateContent}
                        />

                        <div className="flex items-center justify-between mt-4 border-t border-gray-800 pt-4">

                            <div className="flex space-x-6">
                                <FileUpload
                                    onSuccess={(res: IKUploadResponse) => handleTweetMediaUploadSuccess(res, "image")}
                                    fileType="image"
                                    isDisabled={!!mediaUrl}
                                />

                                <FileUpload
                                    onSuccess={(res: IKUploadResponse) => handleTweetMediaUploadSuccess(res, "video")}
                                    fileType="video"
                                    isDisabled={!!mediaUrl}
                                />

                            </div>

                            <div className="flex items-center space-x-4">
                                <div className={`text-sm ${isOverLimit ? "text-red-500" : "text-gray-500"}`}>{remainingCharacters}</div>
                                <div className="h-6 w-px bg-gray-800"></div>

                                <Button
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full px-4 py-2 text-sm"
                                    disabled={tweetContent.length === 0 || isOverLimit}
                                >
                                    Tweet
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </Form>
    )
}