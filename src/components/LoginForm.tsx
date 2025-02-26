"use client"

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import SocialButton from './SocialButton'
import { useRouter } from 'next/navigation'
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from 'lucide-react'
import { signInSchema } from '@/zodSchemas/signInSchema'
import { signIn } from 'next-auth/react'
import Link from 'next/link'

function LoginForm() {

    const [isSubmitting, setIsSubmitting] = useState(false)

    const router = useRouter()
    const { toast } = useToast()

    // zod implementation for form validation
    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: "",
            password: "",
        },
    })


    // Defining a submit handler.
    async function onSubmit(data: z.infer<typeof signInSchema>) {
        setIsSubmitting(true)

        const response = await signIn("credentials", {
            redirect: false,
            identifier: data.identifier,
            password: data.password
        })

        if (response?.error) {

            console.error("Error in login a user: ", response)

            toast({
                title: "Failed to login.",
                description: response.error,
                variant: "destructive"
            })
        }

        if (response?.ok) {
            router.push("/")

            toast({
                title: "Login successful.",
                description: "Redirecting you to the home page.",
            })
        }
        setIsSubmitting(false)
    }

    return (
        <>
            <SocialButton />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-600" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-black px-2 text-gray-400">or</span>
                        </div>
                    </div>
                    <>
                        <div className="space-y-2">
                            <FormField
                                control={form.control}
                                name="identifier"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='text-white'>Email/Username</FormLabel>
                                        <FormControl>
                                            <Input
                                                required={true}
                                                {...field}
                                                className="bg-black border-gray-700 text-white"
                                            />
                                        </FormControl>

                                        <FormMessage className="text-red-500 text-sm" />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="space-y-2">
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='text-white'>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                required={true}
                                                {...field}
                                                className="bg-black border-gray-700 text-white"
                                            />
                                        </FormControl>

                                        <FormMessage className="text-red-500 text-sm" />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-white text-black hover:bg-gray-200"
                        >
                            {
                                isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait
                                    </>
                                ) : ("Login")
                            }
                        </Button>
                    </>
                    <div className="text-center">
                        <Link href={"forgot-password"} className="text-blue-400 hover:underline text-sm">
                            Forgot password?
                        </Link>
                    </div>

                    <p className="text-center text-sm text-gray-400">
                        Don&apos;t have an account?{" "}
                        <a href="/signup" className="text-blue-400 hover:underline">
                            Sign up
                        </a>
                    </p>
                </form>
            </Form>
        </>
    )
}

export default LoginForm;