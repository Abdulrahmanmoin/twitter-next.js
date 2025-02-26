"use client"

import { signUpSchema } from '@/zodSchemas/signUpSchema'
import React, { useEffect, useState } from 'react'
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
import axios, { AxiosError } from 'axios'
import { useDebounceCallback } from 'usehooks-ts'
import { ApiResponse } from '@/types/ApiResponse'
import { useRouter } from 'next/navigation'
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from 'lucide-react'

function SignUpForm() {

    const [username, setUsername] = useState('')
    const [usernameError, setUsernameError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const debounced = useDebounceCallback(setUsername, 500)

    const router = useRouter()
    const { toast } = useToast()

    // zod implementation for form validation
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
            username: "",
        },
    })

    // Defining a username handler for checking uniqueness
    useEffect(() => {
        const usernameHandler = async () => {

            if (username) {
                try {
                    const response = await axios.post('/api/username-unique', { username })
                    setUsernameError(response.data.message)
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse> || ""
                    setUsernameError(axiosError.response?.data?.message ?? "")
                }
            }
        }
        usernameHandler()
    }, [username])

    // Defining a submit handler.
    async function onSubmit(values: z.infer<typeof signUpSchema>) {
        setIsSubmitting(true)

        try {
            const response = await axios.post('/api/sign-up', values)
            if (response.data.success) {
                router.push(`/verification/${values.username}`)
                toast({
                    title: "Account created successfully.",
                    description: "You can now login to your account.",
                })
            }
        } catch (error) {
            console.error(error);

            const axiosError = error as AxiosError<ApiResponse> || ""
            toast({
                title: "Failed to create an account.",
                description: axiosError.response?.data.message || "Please try again.",
                variant: "destructive"
            })
        } finally {
            setIsSubmitting(false)
        }

    }

    return (
        <>
            <SocialButton />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                    {/* <button>Sign in with Google</button> */}

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
                                name="fullName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='text-white'>FullName</FormLabel>
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
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='text-white'>Email</FormLabel>
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
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='text-white'>Username</FormLabel>
                                        <FormControl>
                                            <Input
                                                required={true}
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(e)
                                                    debounced(e.target.value)
                                                }}
                                                className="bg-black border-gray-700 text-white"
                                            />
                                        </FormControl>

                                        <FormMessage
                                            className={`text-sm ${usernameError == "Username is available." ? "text-blue-500" : "text-red-500"}`}
                                        >
                                            {usernameError}
                                        </FormMessage>
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
                                ) : ("Signup")
                            }
                        </Button>
                    </>
                    <p className="text-center text-sm text-gray-400">
                        Already have an account?{" "}
                        <a href="/login" className="text-blue-400 hover:underline">
                            Login
                        </a>
                    </p>
                </form>
            </Form>
        </>
    )
}

export default SignUpForm;