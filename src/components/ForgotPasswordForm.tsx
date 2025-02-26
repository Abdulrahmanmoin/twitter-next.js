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
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from 'lucide-react'
import { emailSchema } from '@/zodSchemas/signUpSchema'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'

export default function ForgotPasswordForm() {

    const [isSubmitting, setIsSubmitting] = useState(false)

    const { toast } = useToast()


    const emailValidaton = z.object({ email: emailSchema }); // making it zod object so that it can be used in useForm

    // zod implementation for form validation
    const form = useForm<z.infer<typeof emailValidaton>>({
        resolver: zodResolver(emailValidaton),
        defaultValues: {
            email: ""
        },
    })

    // Defining a submit handler.
    async function onSubmit(data: z.infer<typeof emailValidaton>) {
        setIsSubmitting(true)

        try {

            const response = await axios.post('/api/forgot-password', { email: data.email })

            toast({
                title: "Email Sent, you can reset your password now.",
                description: response.data.message,
            })

        } catch (error) {
            console.error(error);

            const axiosError = error as AxiosError<ApiResponse> || ""
            toast({
                title: "Failed to send email.",
                description: axiosError.response?.data.message || "Please try again.",
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

                    <div className='py-2 px-4'>
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-gray-600" />
                            </div>
                        </div>
                    </div>

                    <>
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
                                ) : ("Send Email")
                            }
                        </Button>
                    </>
                </form>
            </Form>
        </>
    )
}