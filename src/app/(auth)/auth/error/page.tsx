"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

function ErrorContent() {
  const searchParams = useSearchParams();
  const errorType = searchParams.get("error");
  const { toast } = useToast();
  const [errorMessage, setErrorMessage] = useState("An error occurred while signing in.")

  useEffect(() => {
    if (errorType) {
      // // Customize the message based on error type
      // if (errorType === "This email is already registered using credentials. Please log in with your password.") {
      //   message = "This email is already registered using credentials. Please log in with your email and password.";
      // } else if (errorType === "This email is already using Google. Please log in with Google.") {
      //   message = "This email is already using Google. Please log in with Google."
      // }
      setErrorMessage(errorType)
      toast({
        title: "Sign In Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  }, [errorType, toast]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold">Sign In Error</h1>
      <p className="mt-4">
        {errorMessage}
      </p>
      <Link href="/signup" className="mt-6 text-blue-400 hover:underline">
        Go back to Sign Up
      </Link>
      <Link href="/login" className="mt-6 text-blue-400 hover:underline">
        Go back to Sign In
      </Link>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
          <h1 className="text-3xl font-bold">Loading...</h1>
        </div>
      }
    >
      <ErrorContent />
    </Suspense>
  )
}