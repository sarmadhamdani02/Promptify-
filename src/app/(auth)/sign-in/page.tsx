'use client';

import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { zodResolver } from '@hookform/resolvers/zod';
import { signInSchema } from "@/schemas/signInSchema"; // Use the correct schema
import PromptifyLogo from "@/components/PromptifyLogo";

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

import { useState } from 'react';
import { signIn } from "next-auth/react";

const SignUpPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(signInSchema), // Use correct schema
    defaultValues: {
      username: '',
      password: '',
    }
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);

    try {
      const result = await signIn('credentials', {
        redirect: false, // Fix typo
        username: data.username,
        password: data.password,
      });

      console.log(data)
      console.log(result)

      if (result?.error) {
        toast({
          title: "Log in failed",
          description: result?.error || "Invalid Credentials.",
          variant: "destructive",
        });
        setIsSubmitting(false); // Reset state on error
        return;
      }

      if (result?.url) {
        router.push("/home"); // Correct navigation
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br py-12 px-4 sm:px-6 lg:px-8 bg-blue-50">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl">

        {/* Logo */}
        <PromptifyLogo />

        <h2 className="text-center text-2xl font-semibold text-gray-800 mt-4">
          Welcome!
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Username"
                      {...field}
                      className="border-blue-300 focus:ring-blue-500 focus:border-blue-500"
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
                    <Input type="password" placeholder="Enter Password" {...field} className="border-blue-300 focus:ring-blue-500 focus:border-blue-500" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition">
              {isSubmitting ? (
                <>
                  Logging In <LoaderPinwheel className="animate-spin ml-2 h-5 w-5" />
                </>
              ) : (
                "Log In"
              )}
            </Button>
          </form>
        </Form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-500 font-medium">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
