"use client"

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
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { useRouter } from 'next/navigation'
import { useDebounceCallback } from 'usehooks-ts'
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from 'lucide-react'
import { usernameSchema } from '@/zodSchemas/signUpSchema'
import { useSession } from "next-auth/react";

function SelectUsernameForm() {


    const [username, setUsername] = useState('')
    const [usernameError, setUsernameError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const debounced = useDebounceCallback(setUsername, 500)

    const { update } = useSession();

    const router = useRouter()
    const { toast } = useToast()

    const usernameValidaton = z.object({ username: usernameSchema });

    // zod implementation for form validation
    const form = useForm<z.infer<typeof usernameValidaton>>({
        resolver: zodResolver(usernameValidaton),
        defaultValues: {
            username: "",
        },
    })

    useEffect(() => {
        const usernameHandler = async () => {

            if (username) {
                try {
                    const response = await axios.post('/api/username-unique', { username })
                    setUsernameError(response.data.message)
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse> || ""
                    setUsernameError(axiosError.response?.data?.message || "An error occurred")
                }
            }
        }
        usernameHandler()
    }, [username])

    // Defining a submit handler.
    async function onSubmit(data: z.infer<typeof usernameValidaton>) {
        setIsSubmitting(true)

        try {
            const response = await axios.post('/api/setting-username-google', { username: data.username })

            if (response.data.success) {
                await update({ username: data.username })
                router.push("/")

                toast({
                    title: "Username selected.",
                    description: response.data.message,
                })
            }

        } catch (error) {
            console.error(error);

            const axiosError = error as AxiosError<ApiResponse> || ""

            toast({
                title: "Failed to select username.",
                description: axiosError.response?.data?.message || "",
                variant: "destructive"
            })
        } finally {
            setIsSubmitting(false)
        }

    }

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

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
                            ) : ("Next")
                        }
                    </Button>
                </form>
            </Form>
        </>
    )
}

export default SelectUsernameForm;