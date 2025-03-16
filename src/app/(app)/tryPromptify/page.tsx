'use client';

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"
import Navbar from "@/components/Navbar";
import { Zap } from "lucide-react";
import { createTheme, MantineProvider } from '@mantine/core';
import { LogIn, UserPlus } from "lucide-react"
import { Copy, Save } from "lucide-react"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PromptifyLogo from "@/components/PromptifyLogo";
import axios from "axios";
import { useState, useEffect } from "react";

// Zod schema for form validation
const formSchema = z.object({
    tone: z.string().optional(),
    length: z.string().optional(),
    prompt: z.string().min(1, "Prompt is required"),
    specificInput: z.string().optional(),
});

const HomePage = () => {
    const { toast } = useToast();
    const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [enhancedPrompt, setEnhancedPrompt] = useState("");
    const [trialDrawerOpen, setTrialDrawerOpen] = useState(false); // Initially closed
    const [userTrailCount, setUserTrailCount] = useState(() => {
        const storedValue = localStorage.getItem("userTrailCount");
        return storedValue ? JSON.parse(storedValue) : 0; // Track number of submissions
    });

    const [userTrialCount, setUserTrialCount] = useState<number | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedValue = localStorage.getItem("userTrialCount");
            setUserTrialCount(storedValue ? JSON.parse(storedValue) : 0);
        }
    }, []);

    useEffect(() => {
        if (typeof window !== "undefined" && userTrialCount !== null) {
            localStorage.setItem("userTrialCount", JSON.stringify(userTrialCount));
        }
    }, [userTrialCount]);


    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            tone: "",
            length: "",
            prompt: "",
            specificInput: "",
        }
    });

    const onSubmit = async (data: { prompt: string; tone?: string; length?: string; specificInput?: string }) => {
        setIsGeneratingPrompt(true);

        try {
            // Check if the user has already used their trial
            if (userTrailCount >= 1) {
                setTrialDrawerOpen(true); // Show sign-up/login drawer
                return;
            }

            const response = await axios.post("/api/try-promptify", {
                userInput: data.prompt,
                tone: data.tone,
                length: data.length,
                specific: data.specificInput
            });

            if (response.status !== 200) {
                throw new Error("API returned an error");
            }

            setEnhancedPrompt(response.data.enhancedPrompt);
            setIsDrawerOpen(true); // Show enhanced prompt drawer
            setUserTrailCount((prev: number) => prev + 1); // Increment trial count

        } catch (error) {
            console.error("API Error:", error);
            toast({
                title: "Some Error Occurred",
                description: error instanceof Error ? error.message : String(error) || "Promptify couldn't promptify the prompt. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsGeneratingPrompt(false);
        }
    };


    const onClickCopy = () => {
        navigator.clipboard.writeText(enhancedPrompt);
        toast({
            title: "Copied!",
            description: "Enhanced Prompt has been copied to your clipboard",
        });
    };

    const handleSignUp = () => {
        setTrialDrawerOpen(false);
        window.location.href = "/sign-up";
    };

    const handleLogIn = () => {
        setTrialDrawerOpen(false);
        window.location.href = "/sign-in";
    };

    return (
        <MantineProvider theme={createTheme({})}>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br py-12 px-4 sm:px-6 lg:px-8 bg-blue-50">
                <Navbar />
                <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl">
                    {/* Logo */}
                    <PromptifyLogo />

                    <h2 className="text-center text-2xl font-semibold text-gray-800 mt-4">
                        Generate Your Prompt
                    </h2>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
                            {/* Tone Input */}
                            <FormField
                                control={form.control}
                                name="tone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700">Tone</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="border-blue-300 focus:ring-blue-500 focus:border-blue-500">
                                                    <SelectValue placeholder="Select tone" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="casual">Casual</SelectItem>
                                                <SelectItem value="professional">Professional</SelectItem>
                                                <SelectItem value="friendly">Friendly</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Length Input */}
                            <FormField
                                control={form.control}
                                name="length"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700">Length</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="border-blue-300 focus:ring-blue-500 focus:border-blue-500">
                                                    <SelectValue placeholder="Select length" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="short">Short</SelectItem>
                                                <SelectItem value="medium">Medium</SelectItem>
                                                <SelectItem value="detailed">Detailed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Main Prompt Input */}
                            <FormField
                                control={form.control}
                                name="prompt"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700">Prompt</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                placeholder="Enter your prompt"
                                                {...field}
                                                className="border-blue-300 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Specific Input */}
                            <FormField
                                control={form.control}
                                name="specificInput"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700">Specific Context (Optional)</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter specific Context (Keywords)"
                                                {...field}
                                                className="border-blue-300 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Generate Output Button */}
                            <Button disabled={isGeneratingPrompt} type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition">
                                {isGeneratingPrompt ? <Zap className="animate-spin ml-3" /> : "Promptify"}
                            </Button>
                        </form>
                    </Form>
                </div>

                {/* Drawer for Enhanced Prompt */}
                <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                    <DrawerContent className=" ">
                        <DrawerHeader>
                            <DrawerTitle className="flex items-center justify-center">Generated Prompt</DrawerTitle>
                            <DrawerDescription>Here is your enhanced prompt:</DrawerDescription>
                        </DrawerHeader>
                        <div className="p-4 px-10 flex ">
                            <Textarea
                                className="bg-blue-50 px-4 py-6 rounded-lg w-screen h-full"
                                value={enhancedPrompt}
                                onChange={(e) => setEnhancedPrompt(e.target.value)}
                            />
                            <div className="flex h-auto items-center justify-evenly flex-col">
                                <Button
                                    variant="default"
                                    className="ml-4 w-full border border-blue-200 hover:text-white hover:bg-blue-700 bg-blue-500"
                                    onClick={onClickCopy}
                                >
                                    <Copy />Copy
                                </Button>
                                <Button
                                    variant="default"
                                    className="ml-4 w-full border border-blue-200 hover:text-white hover:bg-blue-700 bg-blue-500"
                                    disabled
                                >
                                    <Save />
                                    Save
                                </Button>
                            </div>
                        </div>
                        <DrawerFooter className="flex items-center justify-center">
                            <DrawerClose asChild>
                                <Button variant="outline" className="w-[40%] border border-blue-200 hover:border-blue-500 hover:text-blue-500">
                                    Close
                                </Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>

                {/* Drawer for Trial Message */}
                <Drawer open={trialDrawerOpen} onOpenChange={setTrialDrawerOpen}>
                    <DrawerContent className="p-6">
                        <DrawerHeader>
                            <DrawerTitle className="text-xl font-semibold text-center">
                                Keep using <span className="text-blue-500">Promptify</span> for free!
                            </DrawerTitle>
                            <DrawerDescription className="text-gray-500 text-center mt-2">
                                Sign up or log in to save and manage your prompts.
                            </DrawerDescription>
                        </DrawerHeader>
                        <div className="flex flex-col gap-4 mt-4">
                            <Button
                                className="bg-blue-500 flex items-center gap-2 w-full"
                                onClick={handleSignUp}
                            >
                                <UserPlus size={18} />
                                Sign Up
                            </Button>
                            <Button
                                className="bg-blue-500 flex items-center gap-2 w-full"
                                onClick={handleLogIn}
                            >
                                <LogIn size={18} />
                                Log In
                            </Button>
                        </div>
                    </DrawerContent>
                </Drawer>
            </div>
        </MantineProvider>
    );
};

export default HomePage;