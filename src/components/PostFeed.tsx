import { IMAGEKIT_URL_ENDPOINT } from "@/constants"
import { IKImage } from "imagekitio-next"
import Image from "next/image"
import LikeTweet from "./LikeTweet"
import Link from "next/link"

interface PostFeedProps {
  name: string
  username: string
  createdAt: string
  content: string
  profilePictureLink: string;
  mediaLink?: string
  tweetId: string
}

export default function PostFeed({
  name,
  username,
  profilePictureLink,
  createdAt,
  content,
  mediaLink,
  tweetId
}: PostFeedProps) {

  // Convert the date string to a Date object
  const dateObj = new Date(createdAt)
  // Format the date to extract only the month and date
  const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: "2-digit" })

  return (

    <div className="divide-y divide-gray-800">
      <article className="p-4">
        <div className="flex">
          <Image
            src={profilePictureLink}
            alt="Avatar"
            width={1000}
            height={1000}
            className="rounded-full w-10 h-10 mr-3"
          />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="flex flex-col sm:flex-row sm:items-center space-x-1">
                {/* for mobile */}
                <div className="flex items-center gap-x-2 sm:hidden">
                  <span className="font-bold hover:underline">{name}</span>
                  <svg className="h-4 w-4 text-blue-500" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z"
                    />
                  </svg>
                </div >

                {/* for desktop  */}

                <Link href={`/profile/${username}`}>
                  <span className="hidden sm:block font-bold hover:underline">{name}</span>
                </Link>
                <svg className="hidden sm:block h-4 w-4 text-blue-500" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z"
                  />
                </svg>

                <span className="text-gray-500">@{username} · {formattedDate}</span>
              </div>

            </div>
            <p className="mt-2 text-gray-200">
              {content}
            </p>
            {mediaLink && (
              <div className="mt-4 rounded-xl overflow-hidden">
                <IKImage
                  urlEndpoint={IMAGEKIT_URL_ENDPOINT}
                  src={mediaLink}
                  width="400"
                  height="400"
                  alt="Post media"
                  className="w-full"
                />
              </div>
            )}
            <div className="flex justify-between mt-4 text-gray-500">
              <LikeTweet tweetId={tweetId} />
            </div>
          </div>
        </div>
      </article>
    </div>
  )
}