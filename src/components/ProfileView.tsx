"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import PostFeed from "@/components/PostFeed"
import { useEffect, useState } from "react"
import axios, { AxiosError } from "axios"
import { useToast } from '@/hooks/use-toast';
import { ApiResponse } from '@/types/ApiResponse';
import { Loader2 } from 'lucide-react';
import { useSession } from "next-auth/react"
import { UserInterface } from "@/models/userModel"
import { MoreOptionsDialogButton } from "./MoreOptionsDialog"
import { ProfileViewProps } from "@/types/propsTypes"
import { TweetExpandedInterface } from "@/types/TweetExpandedType"
import { IMAGEKIT_URL_ENDPOINT } from "@/constants"
import { IKImage } from "imagekitio-next"
import Image from "next/image"
import Link from "next/link"

interface UserExpandedInterface extends UserInterface {
  createdAt: Date
}

export function ProfileView({ username }: ProfileViewProps) {

  const [tweets, setTweets] = useState<TweetExpandedInterface[]>([]);
  const [isTweetLoading, setIsTweetLoading] = useState(false);
  const [userData, setUserData] = useState<UserExpandedInterface | null>();
  const [isUserDataLoading, setIsUserDataLoading] = useState<boolean>(true);
  const [isSessionUser, setIsSessionUser] = useState<boolean>(false)
  const [followAndUnfollowText, setFollowAndUnfollowText] = useState<"Follow" | "Unfollow">("Follow")
  const [isFollowAndUnfollowLoading, setIsFollowAndUnfollowLoading] = useState<boolean>(false)
  const [followingList, setFollowingList] = useState([])
  const [formattedDate, setFormattedDate] = useState<string>("");

  const { data: session } = useSession()
  const { toast } = useToast()
  const defaultProfilePictureLink: string = "/assets/unknown-profile-picture.png"

  // Determine if it's the session user's profile
  useEffect(() => {
    if (session && username) {
      setIsSessionUser(session.user.username === username);
    }
  }, [session, username])

  // Fetch user data based on isSessionUser
  useEffect(() => {

    if ((isSessionUser === null) || !session) return;

    const fetchUserData = async () => {

      try {

        setIsUserDataLoading(true)

        if (isSessionUser) {
          const response = await axios.post("/api/get-user-data", { userId: session?.user._id })
          setUserData(response.data.user || {})
        } else {
          // Fetch other user's data
          const response = await axios.post("/api/get-user-data", { username });
          setUserData(response.data.user || {});
        }

      } catch (error) {
        console.error(error);

        const axiosError = error as AxiosError<ApiResponse> || ""

        if (axiosError.response?.data.message === "User not found.") {
          setUserData(null)
        }

        toast({
          title: "An error occurred while fetching user's data.",
          description: axiosError.response?.data.message || "",
          variant: "destructive"
        })
      } finally {
        setIsUserDataLoading(false)
      }
    }

    fetchUserData()
  }, [isSessionUser, session, username])

  //  fetching tweets
  useEffect(() => {

    if ((isSessionUser === null) || !session) return;

    const fetchTweets = async () => {
      setIsTweetLoading(true)

      try {
        if (isSessionUser && (session.user.username === username)) {
          const response = await axios.get("/api/get-my-tweets")
          setTweets(response.data.tweets || [])
        } else {
          const response = await axios.post("/api/get-user-tweets", { username })
          setTweets(response.data.tweets || [])
        }
      } catch (error) {
        console.error(error);

        const axiosError = error as AxiosError<ApiResponse> || ""
        toast({
          title: "An error occurred while fetching tweets.",
          description: axiosError.response?.data.message || "",
          variant: "destructive"
        })
      } finally {
        setIsTweetLoading(false)
      }
    }

    fetchTweets()
  }, [isSessionUser, session, username])


  // Handle follow by sending username of who got follow to the backend.
  const handleFollow = async () => {
    try {

      setIsFollowAndUnfollowLoading(true)

      if (followAndUnfollowText === "Follow") {
        const response = await axios.post("/api/follow-user", { username })

        if (response.data.success) {
          setFollowAndUnfollowText("Unfollow")
        }
      } else {
        const response = await axios.post("/api/unfollow-user", { username })

        if (response.data.success) {
          setFollowAndUnfollowText("Follow")
        }
      }
    } catch (error) {
      console.error(error);

      const axiosError = error as AxiosError<ApiResponse> || ""
      toast({
        title: "An error occurred while follow a user.",
        description: axiosError.response?.data.message || "Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsFollowAndUnfollowLoading(false)
    }
  }

  // Getting following list.
  useEffect(() => {
    const getFollowingList = async () => {
      try {
        const response = await axios.get("/api/get-all-following-of-session-user");
        setFollowingList(response.data.user.following || []);
      } catch (error) {
        console.error(error);

        const axiosError = error as AxiosError<ApiResponse> || ""
        toast({
          title: "An error occurred while fetching a folloeing list.",
          description: axiosError.response?.data.message || "Please try again.",
          variant: "destructive"
        })
      }
    };

    getFollowingList();
  }, []);

  // setting the following list in state.
  useEffect(() => {
    if (followingList.length > 0 && username) {
      const isFollowing = followingList.some((item: { username: string }) => item.username === username);
      setFollowAndUnfollowText(isFollowing ? "Unfollow" : "Follow");
    }
  }, [followingList, username]);

  // checking is the user data object contain data or is it empty
  useEffect(() => {
    if (userData) {
      // Convert the date string to a Date object
      const dateObj = new Date(userData.createdAt)
      // Format the date to extract only the month and date
      setFormattedDate(dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }))
    }
  }, [userData, formattedDate])

  return (
    <>
      {userData && (
        <div className="min-h-screen pb-16 md:pb-0">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md">
            <div className="flex items-center p-4">
              <Link href={"/"} className="md:hidden">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div className="ml-6">
                <h1 className="text-xl font-bold">{isSessionUser ? session?.user.name : userData.fullName}</h1>
                <p className="text-sm text-gray-500">{userData.tweets?.length} posts</p>
              </div>
            </div>
          </div>

          {/* Profile Header */}
          <div className="relative">

            <div className="absolute left-4 -bottom-16">
              <div className="rounded-full border-4 border-black w-32 h-32 overflow-hidden">
                {
                  (defaultProfilePictureLink === session?.user.profilePicture)
                    || (defaultProfilePictureLink === userData.profilePicture) ?

                    (
                      <Image
                        src={isSessionUser ? session?.user.profilePicture ?? "" : userData.profilePicture ?? ""}
                        alt="Profile picture"
                        width={1000}
                        height={1000}
                        priority
                        className="rounded-full"
                      />
                    ) : (
                      <IKImage
                        urlEndpoint={IMAGEKIT_URL_ENDPOINT}
                        src={isSessionUser ? session?.user.profilePicture : userData.profilePicture}
                        width={1000}
                        height={1000}
                        alt="Profile picture"
                        className="rounded-full"
                      />
                    )
                }
              </div>
            </div>
            <div className="flex justify-end p-4 space-x-2">
              {isSessionUser && (<MoreOptionsDialogButton />)}
              {!isSessionUser && (
                <Button
                  variant="outline"
                  onClick={handleFollow}
                  disabled={isFollowAndUnfollowLoading}
                  className="rounded-full">

                  {isFollowAndUnfollowLoading ?
                    <Loader2 className="animate-spin" />
                    : followAndUnfollowText}
                </Button>)
              }
            </div>
          </div>

          {/* Profile Info */}
          <div className="px-4 mt-16 space-y-4">
            <div>
              <h2 className="text-xl font-bold">{isSessionUser ? session?.user.name : userData.fullName}</h2>
              <p className="text-gray-500">@{isSessionUser ? session?.user.username : userData.username}</p>
            </div>

            <div className="flex flex-wrap gap-y-1 text-gray-500 text-sm">
              <div className="flex items-center mr-4">
                <span className="mr-2">📅</span>
                Joined {formattedDate}
              </div>
            </div>
            <div className="flex space-x-4">
              <button className="hover:underline">
                <span className="font-bold">{userData.following?.length || 0}</span> <span className="text-gray-500">Following</span>
              </button>
              <button className="hover:underline">
                <span className="font-bold">{userData.followers?.length || 0}</span> <span className="text-gray-500">Followers</span>
              </button>
            </div>
          </div>

          {/* Tabs */}


          {
            tweets.length === 0 && isTweetLoading &&
            <>
              <div className='flex  justify-center items-center min-h-screen'>
                <Loader2 className="mr-2 h-8 w-8 animate-spin" />
                <p className='text-center text-2xl text-gray-500 flex flex-col'>
                  Please Wait
                </p>
              </div>
            </>
          }
          {
            tweets.length === 0 &&
            <>
              <div className='flex  justify-center items-center min-h-screen'>
                <p className='text-center text-2xl text-gray-500 flex flex-col'>
                  No tweets yet.
                </p>
              </div>
            </>
          }
          <div className='flex flex-col mt-8' >
            {
              tweets.map((tweet) => (
                <div key={tweet._id} className='flex flex-col border border-gray-800 p-1 rounded-lg my-4'>
                  <PostFeed
                    name={isSessionUser ? session?.user?.name ?? "" : userData.fullName ?? ""}
                    username={isSessionUser ? session?.user?.username ?? "" : userData.username ?? ""}
                    content={tweet.content}
                    createdAt={tweet.createdAt}
                    profilePictureLink={isSessionUser ? session?.user?.profilePicture ?? "" : userData.profilePicture ?? ""}
                    mediaLink={tweet.media}
                    tweetId={tweet._id}
                  />
                </div>
              ))
            }
          </div>
        </div>
      )}

      {isUserDataLoading && (
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="mr-2 h-8 w-8 animate-spin" />
          <p className="text-white font-semibold text-4xl">Loading...</p>
        </div>
      )}

      {!userData && (!isUserDataLoading) && (
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-white font-semibold text-4xl">User not found.</p>
        </div>
      )}
    </>
  )
}

