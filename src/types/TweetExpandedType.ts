import { TweetInterface } from "@/models/tweetModel";

export interface TweetExpandedInterface extends Omit<TweetInterface, 'user'> {
    user: {
        fullName: string;
        username: string;
        profilePicture: string;
    }
    _id: string;
    createdAt: string;
}