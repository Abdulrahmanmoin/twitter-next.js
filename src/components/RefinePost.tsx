"use client"

import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { useCompletion } from '@ai-sdk/react';

interface RefinePostInterface {
    isButtonDisabled: boolean;
    rawContent: string;
    updateContent: (refinedText: string) => void
}

export default function RefinePost({ isButtonDisabled, rawContent, updateContent }: RefinePostInterface) {
    const { toast } = useToast()

    const {
        complete,
        completion,
        isLoading,
    } = useCompletion({
        api: '/api/refine-post',
        // initialCompletion: initialMessageString,
    });

    const fetchRefinePost = async () => {
        try {
            await complete(rawContent);
        } catch (error) {
            console.error("Error while fetching a refined post: ", error)
            const axiosError = error as AxiosError<ApiResponse>

            toast({
                title: "Error",
                description: axiosError.response?.data.message || "Failed to refine your post.",
                variant: "destructive"
            })
        }
    };

    useEffect(() => {
        if (completion) {
            updateContent(completion)
        }
    }, [completion, ])

    return (
        <Button
            type="button"
            onClick={fetchRefinePost}
            disabled={isLoading || isButtonDisabled}
            variant="ghost"
            className='bg-blue-600 hover:bg-blue-950 mt-3'
        >
            {isLoading ? "Refining..." : "Refine post with AI"}
        </Button>
    )
}