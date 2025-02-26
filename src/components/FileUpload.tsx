"use client";
import React, { useState } from "react";
import { IKUpload } from "imagekitio-next";
import { Camera, Loader2, Video } from "lucide-react"
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";

interface FileUploadProps {
    onSuccess: (res: IKUploadResponse) => void;
    isDisabled?: boolean
    onProgress?: (progress: number) => void;
    fileType?: "image" | "video"
}

export default function FileUpload(
    { onSuccess, isDisabled, onProgress, fileType = "image" }: FileUploadProps
) {

    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [successMsg, setSuccessMsg] = useState<string | null>(null)

    // Map fileType to corresponding Lucide icon
    const iconMap = {
        image: Camera,
        video: Video,
    };
    const Icon = iconMap[fileType] || Camera; // Default to Camera if fileType is invalid

    const onError = (err: { message: string }) => {
        console.log("Error", err);
        setError(err.message)
        setUploading(false)
    };

    const handleSuccess = (res: IKUploadResponse) => {
        setUploading(false)
        setError(null)
        setSuccessMsg("File uploaded Sucessfully.")
        onSuccess(res)
    };

    const handleProgressUpload = (evt: ProgressEvent) => {

        if (evt.lengthComputable && onProgress) {
            const percentComplete = (evt.loaded / evt.total) * 100;
            onProgress(Math.round(percentComplete))
        }
    };

    const handleStartUpload = () => {
        setUploading(true)
        setError(null)
    };

    const validateFile = (file: File) => {
        if (fileType === "video") {
            if (!file.type.startsWith("video/")) {
                setError("Please upload a video")
                return false
            }

            // Adjust file size check (100 MB should be 100*1024*1024) 
            // This file size is in bytes 
            if (file.size > 100 * 1024 * 1024) {
                setError("Video size must be 100 MB or less.")
                return false
            }

        } else {
            const validTypes = ["image/jpeg", "image/png", "image/webp"]

            if (!validTypes.includes(file.type)) {
                setError("Please upload a valid file (JPEG, PNG, webP) ")
                return false
            }

            // Adjust file size check (5 MB should be 5*1024*1024)
            // This file size is in bytes 
            if (file.size > 5 * 1024 * 1024) {
                setError("Image size must be 5 MB or less.")
                return false
            }
        }
        // If all checks pass, clear any previous error and return true.
        setError(null);
        return true;
    }

    return (
        <div className="spac-y-2">
            {/* Container for icon and hidden IKUpload */}
            <div className="relative inline-block">
                {/* Lucide Icon with conditional color based on disabled state */}
                <Icon
                    className={`h-6 w-6 cursor-pointer ${isDisabled ? "text-gray-400" : "text-blue-500"
                        }`}
                />
                {/* IKUpload overlay, invisible but clickable */}
                <IKUpload
                    disabled={isDisabled}
                    fileName={fileType === "image" ? "image" : "video"}
                    useUniqueFileName={true}
                    validateFile={validateFile}
                    folder={fileType === "image" ? "/images" : "/videos"}
                    onError={onError}
                    onSuccess={handleSuccess}
                    onUploadStart={handleStartUpload}
                    onUploadProgress={handleProgressUpload}
                    accept={fileType === "image" ? "image/*" : "video/*"}
                    // className="file-input file-input-bordered w-full"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                // transformation={{
                //     pre: "l-text,i-Imagekit,fs-50,l-end",
                //     post: [
                //         {
                //             type: "transformation",
                //             value: "w-100",
                //         },
                //     ],
                // }}
                />
                </div>
                {
                    uploading && (
                        <div className="flex items-center gap-2 text-sm text-green-600">
                            <Loader2 className="animate-spin w-4 h-4" />
                            <span>Uploading...</span>
                        </div>
                    )
                }
                {error && (
                    <div className="text-red-600 text-sm">{error}</div>
                )
                }

                {successMsg && (!error) && (!uploading) && (
                    <div className="text-green-600 text-sm">{successMsg}</div>
                )
                }

            </div>
            );
}