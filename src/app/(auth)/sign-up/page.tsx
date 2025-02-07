'use client';

import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useDebounceValue } from 'usehooks-ts';
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema } from "@/schemas/signUpSchema";
import PromptifyLogo from "@/components/PromptifyLogo";

import { SparklesText } from "@/components/sparkles-text";

import { LoaderPinwheel} from 'lucide-react';

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import axios, { AxiosError } from "axios";
import { useEffect, useState } from 'react';
import { ApiResponse } from "@/types/ApiResponse";

const SignUpPage = () => {
    const [username, setUsername] = useState('');
    const [usernameMessage, setUsernameMessage] = useState('');
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isCheckingPassword, setIsCheckingPassword] = useState(false);

    const [passwordMatchMessage, setPasswordMatchMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [debouncedUsername] = useDebounceValue(username, 300);

    const router = useRouter();
    const { toast } = useToast();

    const form = useForm({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            username: '',
            name: '',
            email: '',
            password: '',
            confirmPassword: ''
        }
    });

    const password = form.watch("password");
    const confirmPassword = form.watch("confirmPassword");

    useEffect(() => {
        const checkUsernameUniqueness = async () => {
            if (debouncedUsername) {
                setIsCheckingUsername(true);
                try {
                    const response = await axios.get(`/api/check-username-unique?username=${debouncedUsername}`);
                    setUsernameMessage(response.data.message);
                    console.log(response.data.message); // Debugging log
                } catch (error) {
                    // Properly extract error message
                    const axiosError = error as AxiosError;
                    const errorMessage = axiosError.response?.data?.message || "Error checking username";

                    setUsernameMessage(errorMessage);
                } finally {
                    setIsCheckingUsername(false);
                }
            }
        };

        checkUsernameUniqueness();
    }, [debouncedUsername]);


    const onSubmit = async (data: z.infer<typeof signupSchema>) => {
        setIsSubmitting(true);
        try {
            const response = await axios.post<ApiResponse>("/api/sign-up", data);
            toast({
                title: "Success",
                description: response.data.message,
            });
            router.replace(`/verify/${username}`);
        } catch (error) {
            console.error("Error signing up:", error);
            const axiosError = error as AxiosError;
            const errorMessage = axiosError.response?.data || "Error signing up";
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br py-12 px-4 sm:px-6 lg:px-8 bg-blue-50">
            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl">

                {/* Logo */}
                <PromptifyLogo />
              

                <h2 className="text-center text-2xl font-semibold text-gray-800 mt-4">
                    Create an account!
                </h2>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700">Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter Name"
                                            {...field}

                                            className="border-blue-500 focus:ring-blue-500 focus:border-blue-500 "
                                        />
                                    </FormControl>

                                </FormItem>
                            )}
                        />

                        <FormField

                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700">Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter a unique username"
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                setUsername(e.target.value);
                                            }}
                                            className="border-blue-300 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                    {isCheckingUsername && <p className="text-sm text-blue-500 mt-1">Checking username...</p>}
                                    {!isCheckingUsername && usernameMessage && <p className={`text-sm ${usernameMessage === "Username is unique." ? "text-green-500" : "text-red-500"} mt-1`}>{usernameMessage}</p>}
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700">Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="example@email.com" {...field} className="border-blue-300 focus:ring-blue-500 focus:border-blue-500" />
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
                                    <FormLabel className="text-gray-700">Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Enter Password" {...field} className="border-blue-300 focus:ring-blue-500 focus:border-blue-500" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={(field) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700">Confirm Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Enter Password" 
                                            className="border-blue-300 focus:ring-blue-500 focus:border-blue-500"
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                if (password !== e.target.value) {
                                                    setPasswordMatchMessage("Passwords do not match!");
                                                } else {
                                                    setPasswordMatchMessage("Passwords match!");
                                                }
                                            }} />
                                    </FormControl>
                                    {isCheckingPassword && <p className="text-sm text-blue-500 mt-1">Checking username...</p>}
                                    <p className="text-sm text-blue-500 mt-1">{passwordMatchMessage}</p>

                                    <FormMessage />
                                </FormItem>
                            )}
                        /> */}

                        <Button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition">
                            {isSubmitting ? (
                                <>
                                    Signing up <LoaderPinwheel className="animate-spin ml-2 h-5 w-5" />
                                </>
                            ) : (
                                "Sign Up"
                            )}
                        </Button>
                    </form>
                </Form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Already a member?{' '}
                        <Link href="/sign-in" className="text-blue-600 hover:text-blue-500 font-medium">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;
