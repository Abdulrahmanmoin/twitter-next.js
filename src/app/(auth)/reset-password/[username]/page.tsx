"use client"

import ResetPasswordForm from "@/components/ResetPasswordForm"
import { useParams, useSearchParams } from "next/navigation"

export default function ForgotPasswordPage() {

    const params = useParams();
    const username: string = params.username as string;

    const searchparams = useSearchParams()
    const code = searchparams.get("code") as string

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
            <div className="space-y-6 w-full max-w-md">
                <div className="text-center">
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-8 w-8 mx-auto text-white">
                        <g>
                            <path
                                fill="currentColor"
                                d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                            ></path>
                        </g>
                    </svg>
                </div>
                <h1 className="text-3xl font-bold text-center">Reset your email</h1>
                <ResetPasswordForm
                    username={username}
                    otpCode={code}
                />
            </div>
        </div>
    )
}