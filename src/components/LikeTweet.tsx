"use client"

import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Heart } from 'lucide-react'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse';
import { useToast } from '@/hooks/use-toast';
import { TweetInterface } from '@/models/tweetModel'
import { useSession } from 'next-auth/react'

interface LikeTweetProps {
    tweetId: string;
}

function LikeTweet({ tweetId }: LikeTweetProps) {

    const [isPostLiked, setIsPostLiked] = useState<boolean>()
    const [tweet, setTweet] = useState<TweetInterface>()
    const [likesCount, setLikesCount] = useState<number>(0)

    const { data: session } = useSession()
    const { toast } = useToast()

    // fetch the tweet by tweetId
    useEffect(() => {
        if (!tweetId) return

        const fetchTweet = async () => {
            try {
                const response = await axios.post("/api/get-one-tweet", { tweetId })
                setTweet(response.data.tweet)
                setLikesCount(response.data.tweet.likesBy?.length)

            } catch (error) {
                console.error(error);

                const axiosError = error as AxiosError<ApiResponse> || ""
                toast({
                    title: "An error occurred while fetching tweet.",
                    description: axiosError.response?.data.message || "",
                    variant: "destructive"
                })
            }
        }

        fetchTweet()
    }, [tweetId])

    //  check if loggedin user already liked a post or not. 
    useEffect(() => {

        if (tweet && session) {
            const alreadyLiked: boolean = tweet?.likesBy?.some(
                (item) => item?.toString() === session?.user._id
            ) || false;
            setIsPostLiked(alreadyLiked)
        }

    }, [tweet, session])

    const handleLikeButton = async () => {
        const previousStateOfisPostLiked = isPostLiked;
        const previousStateOfLikesCount = likesCount
        try {
            if (!isPostLiked) {
                setIsPostLiked(true)
                setLikesCount(prev => prev + 1)

                await axios.post("/api/like-post", { tweetId })


                toast({
                    title: "Post liked succesfully.",
                    description: "You liked the post sucessfuly.",
                })
            } else {
                setIsPostLiked(false)
                setLikesCount(prev => prev - 1)

                await axios.post("/api/unlike-post", { tweetId })

                toast({
                    title: "Post unliked succesfully.",
                    description: "You unliked the post.",
                })
            }


        } catch (error) {

            setIsPostLiked(previousStateOfisPostLiked)
            setLikesCount(previousStateOfLikesCount)

            console.error(error);

            const axiosError = error as AxiosError<ApiResponse> || ""

            toast({
                title: "An error occurred while liking tweet.",
                description: axiosError.response?.data.message || "",
                variant: "destructive"
            })
        }
    }

    return (
        <Button
            variant="ghost"
            onClick={handleLikeButton}
            className="rounded-full"
        >
            <Heart
                fill={isPostLiked ? 'currentColor' : "none"}
                className={`${isPostLiked ? "text-red-900" : "text-gray-500"} `}
            />
            {likesCount}
        </Button>
    )
}

export default LikeTweet