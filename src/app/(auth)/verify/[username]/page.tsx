'use client'

import PromptifyLogo from '@/components/PromptifyLogo';
import { useToast } from '@/hooks/use-toast';
import { verifySchema } from '@/schemas/verifySchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { LoaderPinwheel } from 'lucide-react';
import { REGEXP_ONLY_DIGITS } from "input-otp"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"

const VerifyAccount = () => {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false); // ✅ State for loader

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        console.log("🚀 Submit button clicked! Data:", data);
        setIsSubmitting(true); // ✅ Show loader when submitting

        try {
            console.log("📡 Sending request to /api/veridy-code");
            const response = await axios.post("/api/veridy-code", {
                username: params.username,
                code: data.verifyCode,
            });

            console.log("✅ Response received:", response.data);

            toast({
                title: "✅ Success",
                description: "Account verified successfully. You can now login.",
            });

            router.replace('/sign-in');
        } catch (error) {
            console.error("❌ API call failed:", error);
            const axiosError = error as AxiosError<ApiResponse>;
            console.log("🛑 Axios Error:", axiosError?.response?.data);

            toast({
                title: "❌ Error",
                description: axiosError?.response?.data?.message || "Failed to verify account. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false); // ✅ Hide loader after submission
        }
    };

    const form = useForm({
        resolver: zodResolver(verifySchema),
    });

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br py-12 px-4 sm:px-6 lg:px-8 bg-blue-50">
            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl">
                {/* Logo */}
                <PromptifyLogo />

                <h2 className="text-center text-2xl font-semibold text-gray-800 mt-4">
                    Verify Account
                </h2>

                <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-10">
                            <FormField
                                control={form.control}
                                name="verifyCode" // ✅ Fixed incorrect field name
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>One-Time Password</FormLabel>
                                        <FormControl>
                                            <div className="w-full flex justify-center">
                                                <InputOTP maxLength={6} {...field} pattern={REGEXP_ONLY_DIGITS}>
                                                    <InputOTPGroup className="border border-blue-400 rounded-lg flex justify-center">
                                                        {[...Array(6)].map((_, index) => (
                                                            <InputOTPSlot
                                                                key={index}
                                                                index={index}
                                                                className="border border-blue-400 focus:border-blue-600 focus:outline-none"
                                                            />
                                                        ))}
                                                    </InputOTPGroup>
                                                </InputOTP>
                                            </div>
                                        </FormControl>
                                        <FormDescription>
                                            Please enter the one-time password sent to your Email.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                disabled={isSubmitting} // ✅ Disable button when submitting
                                className="mt-10 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition"
                            >
                                {isSubmitting ? (
                                    <>Submitting <LoaderPinwheel className="animate-spin ml-2 h-5 w-5" /></>
                                ) : (
                                    "Submit OTP"
                                )}
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    )
}

export default VerifyAccount;
