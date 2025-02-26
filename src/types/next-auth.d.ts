import "next-auth"
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      _id?: string;
      isVerified?: boolean;
      username?: string;
      needsUsernameUpdate?: boolean;
      profilePicture?: string
      fullName?: string
    } & DefaultSession['user'];
  }

  interface User {
    _id?: string;
    isVerified?: boolean;
    username?: string;
    needsUsernameUpdate?: boolean;
    profilePicture?: string
    fullName?: string
  }

  interface Profile {
    email_verified?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    isVerified?: boolean;
    username?: string;
    needsUsernameUpdate?: boolean
    profilePicture?: string
    fullName?: string
  }
}