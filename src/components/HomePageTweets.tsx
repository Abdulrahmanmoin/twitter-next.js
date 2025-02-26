"use client"

import { useToast } from '@/hooks/use-toast';
import { ApiResponse } from '@/types/ApiResponse';
import axios, { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react'
import PostFeed from './PostFeed';
import { Loader2 } from 'lucide-react';
import { TweetExpandedInterface } from '@/types/TweetExpandedType';

export default function HomePageTweets() {

    const [tweets, setTweets] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const { toast } = useToast()

    useEffect(() => {
        const fetchTweets = async () => {

            setIsLoading(true)

            try {

                const response = await axios.get("/api/get-tweets")
                setTweets(response.data.tweets || [])
            } catch (error) {
                console.error(error);

                const axiosError = error as AxiosError<ApiResponse> || ""
                toast({
                    title: "An error occurred while fetching tweets.",
                    description: axiosError.response?.data.message || "",
                    variant: "destructive"
                })
            } finally {
                setIsLoading(false)
            }
        }

        fetchTweets()
    }, [])


    return (
        <>
            {
                tweets.length === 0 && isLoading &&
                <>
                    <div className='flex  justify-center items-center min-h-screen'>
                        <Loader2 className="mr-2 h-8 w-8 animate-spin" />
                        <p className='text-center text-2xl text-gray-500 flex flex-col'>
                            Please Wait
                        </p>
                    </div>
                </>
            }
            <div className='flex flex-col' >
                {
                    tweets.map((tweet: TweetExpandedInterface) => (
                        <div key={tweet._id} className='flex flex-col border border-gray-800 p-4 rounded-lg my-4'>
                            <PostFeed
                                name={tweet.user.fullName}
                                username={tweet.user.username}
                                content={tweet.content}
                                createdAt={tweet.createdAt}
                                profilePictureLink={tweet.user.profilePicture || ""}
                                mediaLink={tweet.media || ""}
                                tweetId={tweet._id}
                            />
                        </div>
                    ))
                }
            </div>
        </>
    )
}