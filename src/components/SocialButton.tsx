"use client"

import React, { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Loader2 } from 'lucide-react'

export default function SocialButton() {

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSignIn = async () => {
      setIsSubmitting(true)
      await signIn("google")
     setTimeout(() => {
      setIsSubmitting(false)
     }, 4000);
  }

  return (
    <>
      <Button
        variant="outline"
        disabled={isSubmitting}
        onClick={handleSignIn}
        className="w-full py-5 bg-transparent border-gray-700 text-white hover:bg-gray-800"
      >
        <Image
          src={"/assets/google-icon.svg"}
          alt="google-icon"
          width={100}
          height={100}
          className="w-6 h-6"
        />
        {
          isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait
            </>
          ) : ("Sign in with Google")
        }
      </Button >
    </>
  )
}

