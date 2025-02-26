import { Account, NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs"
import dbConnect from "@/utils/dbConnect";
import { UserModel } from "@/models/userModel";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                identifier: { label: "Email/Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials): Promise<User> {

                if (!credentials?.identifier || !credentials?.password) {
                    throw new Error("Missing email or password");
                }

                await dbConnect()

                try {
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.identifier },
                            { username: credentials.identifier }
                        ]
                    })

                    if (user?.provider === "google") {
                        throw new Error("This email is already registered using Google. Please log in with Google.")
                    }

                    if (!user) {
                        throw new Error("No user found with this email or username")
                    }

                    if (!user.isVerified) {
                        throw new Error("Please verify your account before login!")
                    }

                    if (!user.password) {
                        throw new Error("This account does not have a password. Please use the provider you signed up with.");
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)

                    if (isPasswordCorrect) {
                        return user as User
                    } else {
                        throw new Error("Incorrect Password!")
                    }

                } catch (err) {
                    if (err instanceof Error) {
                        throw new Error(err.message);
                    }
                    throw new Error("An unknown error occurred.");
                }
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        })
    ],
    pages: {
        signIn: '/sign-in',
        error: '/auth/error'
    },
    callbacks: {
        async signIn({ user, account }: { user: User; account: Account | null}) {
            if (account?.provider === "google") {
                await dbConnect();

                if (!user?.email) {
                    throw new Error("No email in user");
                }

                const existingUser = await UserModel.findOne({ email: user.email });

                if (!existingUser) {
                    return true;
                }

                if (existingUser?.provider !== "google") {
                    throw new Error("This email is already registered using credentials. Please log in with your password.")
                }

                return true;
            }
            return true;
        },
        async jwt({ token, user, account, profile, trigger, session }) {
          
            if (trigger === "update" && session?.username) {
                token.username = session.username;
                token.needsUsernameUpdate = false;
            }
          
            if (trigger === "update" && session?.profilePicture) {
                token.profilePicture = session.profilePicture;
            }
          
            if (user) {

                // If the user is logging in with Google

                if (account?.provider === "google") {
                    await dbConnect();

                    let existedUser = await UserModel.findOne({ email: user.email })

                    if (!existedUser) {
                        existedUser = await UserModel.create({
                            email: user.email,
                            fullName: user.name,
                            username: user?.email?.split("@")[0],
                            password: "",
                            profilePicture: user.image,
                            isVerified: profile?.email_verified ?? false,
                            provider: "google",
                            needsUsernameUpdate: true,
                        })
                    }

                    token._id = existedUser._id?.toString()
                    token.name = existedUser.fullName
                    token.isVerified = existedUser.isVerified;
                    token.email = existedUser.email
                    token.profilePicture = existedUser.profilePicture
                    token.username = existedUser.username
                    token.needsUsernameUpdate = existedUser.needsUsernameUpdate;

                } else {
                    token._id = user._id?.toString()
                    token.isVerified = user.isVerified;
                    token.email = user.email
                    token.name = user.fullName
                    token.profilePicture = user.profilePicture
                    token.username = user.username
                    token.needsUsernameUpdate = user.needsUsernameUpdate;
                }
            }
            return token
        },
        async session({ session, token, trigger, newSession }) {

            if (trigger === "update" && newSession?.username) {
                session.user.username = newSession.username;
                session.user.needsUsernameUpdate = false;
            }

            if (trigger === "update" && newSession?.profilePicture) {
                session.user.profilePicture = newSession.profilePicture;
            }

            if (token) {

                // `session.user` is initialized before assigning values
                session.user = session.user || {};

                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.email = token.email;
                session.user.name = token.name;
                session.user.profilePicture = token.profilePicture;
                session.user.username = token.username;
                session.user.needsUsernameUpdate = token.needsUsernameUpdate;
                session.user.image = undefined;
            }
            return session
        },
    },
    session: {
        strategy: 'jwt'
    },
    secret: process.env.NEXTAUTH_SECRET,
}