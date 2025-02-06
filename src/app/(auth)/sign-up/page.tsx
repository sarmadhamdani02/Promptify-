'use client';

import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useDebounceValue } from 'usehooks-ts'
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation";
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema } from "@/schemas/signUpSchema";

import { LoaderPinwheel, zap } from 'lucide-react';

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
import { Input } from "@/components/ui/input"

import axios, { AxiosError } from "axios";

import React, { useEffect, useState } from 'react'
import { ApiResponse } from "@/types/ApiResponse";

const page = () => {

    const [username, setUsername] = useState('');
    const [usernameMessage, setUsernameMessage] = useState('');
    const [isCheckingUserName, setisCheckingUserName] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const debouncedUsername = useDebounceValue(username, 300);

    const router = useRouter();
    const { toast } = useToast()

    // zod implementation

    const form = useForm({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            username: '',
            name: '',
            email: '',
            password: '',
            confirmPassword: '' // Add this field to default values
        }
    });

    // checking username

    useEffect(() => {

        const cehckUsernameUniqueness = async () => {
            setUsername('');
            setisCheckingUserName(true);

            if (debouncedUsername) {

                try {

                    const response = await axios.get("api/check-username-unique?username=" + debouncedUsername);
                    setUsernameMessage(response.data.message);

                } catch (error) {
                    console.error("sign-in>page.tsx>cehckUsernameUniqueness()", " :: Error ❌ : ", error);
                    const axiosError = error as AxiosError;
                    setUsernameMessage(axiosError.response?.data.messsage ?? "Error checking username")
                }
                finally {
                    setisCheckingUserName(false);
                }

            }
        }

        cehckUsernameUniqueness();

    }, [debouncedUsername]);

    const onSubmit = async (data: z.infer<typeof signupSchema>) => {
        setIsSubmitting(true);
        console.log("OnSubmit data: ", data)

        try {

            const response = await axios.post<ApiResponse>("/api/sign-up", data);

            toast({
                title: "Success",
                description: response.data.message,
            });

            router.replace(`/verify/${username}`);

        } catch (error) {
            console.error("sign-in>page.tsx>cehckUsernameUniqueness()", " :: Error ❌ : ", error);

            const axiosError = error as AxiosError;
            const errorMessage = axiosError.response?.data.messsage;
            toast({
                title: "Error",
                description: errorMessage ?? "Error signing up",
                variant: "destructive",
            });

        } finally {
            setIsSubmitting(false)
        }

    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-center text-3xl font-bold text-gray-900 mb-6">
                    Sign Up
                </h2>
                <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-6">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input placeholder="username" {...field}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    setUsername(e.target.value);
                                                }} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="example@email.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="Enter Password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* TODO: add this fun() */}
                            {/* <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="Confirm Password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            /> */}
                            <Button type="submit" disabled={isSubmitting}>
                                {
                                    isSubmitting ? (<>Signing you up <LoaderPinwheel className=" animate-spin mr-2 h-4 w-4" /> </>) : (SignUp)
                                }
                            </Button>
                        </form>
                    </Form>

                    <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                        Already a member?{' '}
                        <Link href="/signin" className="text-blue-600 hover:text-blue-500">
                            Sign In
                        </Link>
                    </p>
                </div>
                </div>
            </div>
        </div>
    )
}

export default page
