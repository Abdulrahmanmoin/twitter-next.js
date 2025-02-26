"use client"

import axios from "axios";
import { ImageKitProvider } from "imagekitio-next";
import { SessionProvider } from "next-auth/react";
import React from "react";

const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;
const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY;


export default function Providers({ children }: { children: React.ReactNode }) {

    const authenticator = async () => {
        try {
            const response = await axios.get("/api/imagekit-auth");

            if (response.data.ok === false) {
                const errorText = JSON.stringify(response.data)
                throw new Error(`Request failed with status ${response.status}: ${errorText}`);
            }

            // const data = await response. .json();
            const { signature, expire, token } = response.data;
            return { signature, expire, token };
        } catch (error) {
            console.error(error);
            throw new Error(`Authentication request failed.`);
        }
    };

    return (
        <SessionProvider>
            <ImageKitProvider
                urlEndpoint={urlEndpoint}
                publicKey={publicKey}
                authenticator={authenticator}
            >
                {/* ...client side upload component goes here */}
                {children}
            </ImageKitProvider>
        </SessionProvider>
    );
}