"use client"

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { useRouter } from 'next/navigation'
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from 'lucide-react'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { verifyCodeSchema } from '@/zodSchemas/verifyCodeSchema'
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp'

interface VerificationCodeFormProps {
    username: string;
}

export default function VerificationCodeForm({ username }: VerificationCodeFormProps) {

    const [isSubmitting, setIsSubmitting] = useState(false)

    const router = useRouter()
    const { toast } = useToast()


    const verifyCodeValidaton = z.object({ otpCode: verifyCodeSchema }); // making it zod object so that it can be used in useForm

    // zod implementation for form validation
    const form = useForm<z.infer<typeof verifyCodeValidaton>>({
        resolver: zodResolver(verifyCodeValidaton),
        defaultValues: {
            otpCode: ""
        },
    })

    // Defining a submit handler.
    async function onSubmit(data: z.infer<typeof verifyCodeValidaton>) {
        setIsSubmitting(true)

        try {

            const response = await axios.post('/api/verify-code', {
                username,
                code: data.otpCode,
            })

            toast({
                title: "Account verified successfully.",
                description: response.data.message,
            })

            router.push('/login')

        } catch (error) {
            console.error(error);

            const axiosError = error as AxiosError<ApiResponse> || ""
            toast({
                title: "Failed to verify your account.",
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
                                name="otpCode"
                                render={({ field }) => (
                                    <FormItem className='flex flex-col items-center'>
                                        <FormLabel className='text-white'>Verification Code</FormLabel>
                                        <FormControl>
                                            <InputOTP
                                                maxLength={6}
                                                {...field}

                                            >
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={0} className='sm:w-14 sm:h-14' />
                                                    <InputOTPSlot index={1} className='sm:w-14 sm:h-14' />
                                                    <InputOTPSlot index={2} className='sm:w-14 sm:h-14' />
                                                    <InputOTPSlot index={3} className='sm:w-14 sm:h-14' />
                                                    <InputOTPSlot index={4} className='sm:w-14 sm:h-14' />
                                                    <InputOTPSlot index={5} className='sm:w-14 sm:h-14' />
                                                </InputOTPGroup>
                                            </InputOTP>
                                        </FormControl>
                                        <FormDescription className='self-start'>
                                            Please enter the verification code sent to your email.
                                        </FormDescription>

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
                                ) : ("Verify Account")
                            }
                        </Button>
                    </>
                </form>
            </Form>
        </>
    )
}