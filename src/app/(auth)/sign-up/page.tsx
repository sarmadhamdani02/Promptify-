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
import { LoaderPinwheel } from 'lucide-react';
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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [debouncedUsername] = useDebounceValue(username, 300);
    const router = useRouter();
    const { toast } = useToast();

    const form = useForm({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            name: '',
            username: '',
            email: '',
            password: '',
            confirmPassword: ''
        }
    });



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

          // ✅ Ensure username is sent properly
          const fixedData = {
            ...data,
            username: data.username || form.getValues("username"), // Get the latest username if missing
        };

        console.log("data: to log in" ,fixedData)
        try {
            const response = await axios.post<ApiResponse>("/api/sign-up", fixedData);
            toast({
                title: "Success",
                description: response.data.message,
            });
            router.replace(`/verify/${fixedData?.username}`);
        } catch (error) {
            console.error("Error signing up:", error);
            
            if (axios.isAxiosError(error)) {
              const errorMessage = error.response?.data?.message || "Error signing up";
          
              // If the error is a 400 (Bad Request), show a toast instead of crashing
              if (error.response?.status === 400) {
                toast({
                  title: "Sign-Up Failed",
                  description: errorMessage,
                  variant: "destructive",
                });
              } else {
                // For other errors (e.g., server issues), log them properly
                toast({
                  title: "Something went wrong",
                  description: "Please try again later.",
                  variant: "destructive",
                });
              }
            } else {
              // Handle non-Axios errors
              toast({
                title: "Unexpected Error",
                description: "An unknown error occurred.",
                variant: "destructive",
              });
            }
          }
           finally {
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
                                            className="border-blue-500 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
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
                                            className="border-blue-300 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
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
                                        <Input
                                            type="email"
                                            placeholder="example@email.com"
                                            {...field}
                                            className="border-blue-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500"
                                        />
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
                                        <Input
                                            type="password"
                                            placeholder="Enter Password"
                                            {...field}
                                            className="text-gray-800 border-blue-300 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition"
                        >
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
                        <button
                            className="text-blue-600 hover:text-blue-500 font-medium"
                            onClick={() => router.push('/sign-in')}
                        >
                            Log In
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;
