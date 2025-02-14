'use client'

import PromptifyLogo from '@/components/PromptifyLogo';
import { useToast } from '@/hooks/use-toast';
import { verifySchema } from '@/schemas/verifySchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import React from 'react'
import { useForm } from 'react-hook-form';
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { REGEXP_ONLY_DIGITS_AND_CHARS, REGEXP_ONLY_DIGITS } from "input-otp"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"


const VerifyAccount = () => {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {

        try {
            const response = await axios.post("/api/veridy-code", {
                username: params.username,
                code: data.verifyCode,
            });

            toast({
                title: "Success",
                description: "Account verified successfully. You can now login.",
            });

            router.replace('/sing-in');
        } catch (error) {
            console.error("Verify>page.tsx>onSubmit()", " :: Error ❌ : ", error);

            const axiosError = error as AxiosError<ApiResponse>;

            toast({
                title: "Error",
                description: "Failed to verify account. Please try again.",
                variant: "destructive",
            });
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
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>One-Time Password</FormLabel>
                                        <FormControl >
                                            <div className="w-full flex justify-center">
                                                <InputOTP maxLength={6} {...field} pattern={REGEXP_ONLY_DIGITS}>
                                                    <InputOTPGroup className="border border-blue-400 rounded-lg flex justify-center">
                                                        <InputOTPSlot index={0} className="border border-blue-400 focus:border-blue-600 focus:outline-none" />
                                                        <InputOTPSlot index={1} className="border border-blue-400 focus:border-blue-600 focus:outline-none" />
                                                        <InputOTPSlot index={2} className="border border-blue-400 focus:border-blue-600 focus:outline-none" />
                                                        <InputOTPSlot index={3} className="border border-blue-400 focus:border-blue-600 focus:outline-none" />
                                                        <InputOTPSlot index={4} className="border border-blue-400 focus:border-blue-600 focus:outline-none" />
                                                        <InputOTPSlot index={5} className="border border-blue-400 focus:border-blue-600 focus:outline-none" />
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
                            <Button type="submit" className=" mt-10 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition">
                                Submit OTP

                            </Button>
                        </form>
                    </Form>
                </div>

            </div>
        </div>
    )
}

export default VerifyAccount