"use client"

import PostFeed from '@/components/PostFeed'
import { TweetExpandedInterface } from '@/types/TweetExpandedType'
import axios from 'axios'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export default function Search() {

    const [searchResults, setSearchResults] = useState([])
    const [isSearchResultLoading, setIsSearchResultLoading] = useState(true)

    const searchQuery = useSearchParams()
    const query = searchQuery.get("q")

    useEffect(() => {

        const fetchSearchedPosts = async () => {
            try {
                setIsSearchResultLoading(true)
                const response = await axios.get(`/api/search?q=${query}`)
                setSearchResults(response.data.searchResult)
            } catch (error) {
                console.error("Error fetching searched posts: ", error);
            } finally {
                setIsSearchResultLoading(false)
            }
        }

        fetchSearchedPosts()
    }, [query])

    return (
        <div>
            <h1 className='p-5 font-bold text-2xl md:text-center'>Search Results for &ldquo;#{query}&ldquo;</h1>
            {(searchResults.length > 0) && (

                <div className='flex flex-col items-center px-4' >
                    {
                        searchResults.map((tweet: TweetExpandedInterface) => (
                            <div key={tweet._id} className='flex flex-col border border-gray-800 p-4 rounded-lg my-4 w-full md:w-3/4 lg:1/2'>
                                <PostFeed
                                    name={tweet.user.fullName}
                                    username={tweet.user.username}
                                    profilePictureLink={tweet.user.profilePicture}
                                    createdAt={tweet.createdAt}
                                    content={tweet.content}
                                    mediaLink={tweet.media || ""}
                                    tweetId={tweet._id}
                                />
                            </div>
                        ))}
                </div>
            )}
            {isSearchResultLoading && (
                <p className='p-5 font-bold text-2xl md:text-center'>Loading...</p>
            )}

            {
                ((!isSearchResultLoading) && (searchResults.length == 0)) &&
                (
                    <p className='p-5 font-bold text-2xl md:text-center'>No tweets found.</p>
                )
            }
        </div>
    )
}