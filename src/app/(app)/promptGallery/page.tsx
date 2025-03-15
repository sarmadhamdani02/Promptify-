"use client";

import { useEffect, useState } from "react";
import { LucideIcon, Copy, ArrowUp, ArrowDown, Loader } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import UploadPrompt from "@/components/UploadPrompt";
import { useSession } from "next-auth/react";
import axios from "axios";
import PromptGalleryLogo from "@/components/PromptGalleryLogo";
import Navbar from "@/components/Navbar";
import { Modal } from "@mantine/core";

interface Prompt {
    _id: string;
    username: string;
    description: string;
    title: string;
    prompt: string;
    upVotes: string[];
    downVotes: string[];
    createdAt: string;
}



const fetchPrompts = async (): Promise<Prompt[]> => {
    const response = await fetch("/api/getPromptsGallery");
    const data = await response.json();
    return data.message;
};

export default function PromptGallery() {
    const { data: session } = useSession();
    const user = session?.user;
    const { toast } = useToast();
    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const [uploadPromptComponent, setUploadPromptComponent] = useState(false);
    const [loading, setLoading] = useState(true);
    console.log("🔍 User session data:", user);

    useEffect(() => {
        fetchPrompts().then((data) => {
            const sortedPrompts = data.sort((a, b) => (b.upVotes.length - b.downVotes.length) - (a.upVotes.length - a.downVotes.length));
            setPrompts(sortedPrompts);
            setLoading(false);
        });
    }, []);

    const handleCopy = (prompt: string) => {
        navigator.clipboard.writeText(prompt);
        toast({
            title: "Copied!",
            description: "Prompt has been copied to your clipboard",
        });
    };

    return (
        <div className="bg-blue-50 min-h-screen p-8">
            <Navbar />

            <div className="flex flex-col items-center w-full gap-6 transition-all duration-500 mt-20">
                <PromptGalleryLogo className="scale-110" />
                <button
                    onClick={() => setUploadPromptComponent(true)}
                    className="bg-blue-500 text-lg font-semibold rounded-lg transition-all duration-300 px-8 py-3 hover:bg-blue-600 text-white shadow-md"
                >
                    + Upload Your Prompt
                </button>
            </div>

            <Modal
                opened={uploadPromptComponent}
                onClose={() => setUploadPromptComponent(false)}
                title="Upload Your Prompt"
                centered
            >
                <UploadPrompt onClose={() => setUploadPromptComponent(false)} />
            </Modal>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader className="animate-spin h-12 w-12 text-blue-500" />
                </div>
            ) : (
                <div className="flex flex-col gap-6 p-12">
                    {prompts.map((prompt) => {
                        const isUpvoted = prompt.upVotes.includes(user?._id);
                        const isDownvoted = prompt.downVotes.includes(user?._id);

                        return (
                            <div
                                key={prompt._id}
                                className="bg-white hover:shadow-lg transition rounded-[30px] overflow-hidden p-6 border border-blue-500"
                            >
                                <h2 className="text-xl font-bold text-black">{prompt.title}</h2>
                                <p className="text-xs text-gray-500 hover:underline cursor-pointer">@{prompt.username}</p>
                                <p className="text-gray-700 text-sm mt-2">{prompt.description}</p>

                                <div className="bg-blue-50 rounded-2xl mt-4 flex justify-between py-2 px-3">
                                    <p className="text-gray-800 whitespace-pre-line max-h-32 overflow-y-auto px-3 py-6">{prompt.prompt}</p>
                                    <button
                                        onClick={() => handleCopy(prompt.prompt)}
                                        className="text-blue-500 flex items-center space-x-2 p-2 rounded-md hover:bg-blue-100"
                                    >
                                        <Copy className="h-5 w-5" />
                                        <span>Copy</span>
                                    </button>
                                </div>

                                <p className="text-xs text-gray-400 hover:underline cursor-pointer mt-4">
                                    Posted at <span className="text-gray-400">{format(new Date(prompt.createdAt), "dd MMM yyyy")}</span>
                                </p>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

