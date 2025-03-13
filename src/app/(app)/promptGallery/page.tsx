"use client";

import { useEffect, useState } from "react";
import { LucideIcon, Copy, ArrowUp, ArrowDown } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import UploadPrompt from "@/components/UploadPrompt";
import { useSession } from "next-auth/react";
import axios from "axios";
import PromptGalleryLogo from "../../../components/PromptGalleryLogo";
import { Modal } from '@mantine/core';

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

    useEffect(() => {
        fetchPrompts().then(setPrompts);
    }, []);

    const handleCopy = (prompt: string) => {
        navigator.clipboard.writeText(prompt);
        toast({
            title: "Copied!",
            description: "Prompt has been copied to your clipboard",
        });
    };

    const handleUpvote = async (promptId: string) => {
        if (!user?._id) return;

        setPrompts((prev) =>
            prev.map((p) => {
                if (p._id !== promptId) return p;

                const isUpvoted = p.upVotes.includes(user._id);
                const isDownvoted = p.downVotes.includes(user._id);

                return {
                    ...p,
                    upVotes: isUpvoted
                        ? p.upVotes.filter((u) => u !== user._id)
                        : [...p.upVotes, user._id],
                    downVotes: isDownvoted
                        ? p.downVotes.filter((u) => u !== user._id)
                        : p.downVotes,
                };
            })
        );

        try {
            await axios.post("/api/upVotes", { id: promptId, userId: user._id });
        } catch (error) {
            console.error("❌ Error in handleUpvote():", error);
        }
    };

    const handleDownvote = async (promptId: string) => {
        if (!user?._id) return;

        setPrompts((prev) =>
            prev.map((p) => {
                if (p._id !== promptId) return p;

                const isDownvoted = p.downVotes.includes(user._id);
                const isUpvoted = p.upVotes.includes(user._id);

                return {
                    ...p,
                    downVotes: isDownvoted
                        ? p.downVotes.filter((u) => u !== user._id)
                        : [...p.downVotes, user._id],
                    upVotes: isUpvoted
                        ? p.upVotes.filter((u) => u !== user._id)
                        : p.upVotes,
                };
            })
        );

        try {
            await axios.post("/api/downVotes", { id: promptId, userId: user._id });
        } catch (error) {
            console.error("❌ Error in handleDownvote():", error);
        }
    };

    return (
        <div className="bg-blue-50 min-h-screen p-8">
            <div className="flex flex-col items-center w-full gap-10 transition-all duration-500">
                <PromptGalleryLogo />
                <button
                    onClick={() => setUploadPromptComponent(true)}
                    className="bg-blue-500 rounded-lg transition-all duration-300 px-6 py-3 hover:bg-blue-600 text-white"
                >
                    Upload your prompt
                </button>
            </div>
            <Modal
                opened={uploadPromptComponent}
                onClose={() => setUploadPromptComponent(false)}
                title="Upload Your Prompt"
                centered
            >
                <UploadPrompt />
            </Modal>
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
                            <div className="flex justify-between items-center mt-6">
                                <div className="flex space-x-4 justify-center items-center">
                                    <button
                                        onClick={() => handleUpvote(prompt._id)}
                                        className={`flex items-center space-x-2 p-2 rounded-md hover:bg-green-100 ${isUpvoted ? "bg-green-100" : ""}`}
                                    >
                                        <ArrowUp className="h-5 w-5 text-green-500" />
                                    </button>
                                    <span className={prompt.upVotes.length - prompt.downVotes.length < 0 ? "text-red-500" : "text-blue-500"}>
                                        {prompt.upVotes.length - prompt.downVotes.length}
                                    </span>
                                    <button
                                        onClick={() => handleDownvote(prompt._id)}
                                        className={`flex items-center space-x-2 p-2 rounded-md hover:bg-red-100 ${isDownvoted ? "bg-red-100" : ""}`}
                                    >
                                        <ArrowDown className="h-5 w-5 text-red-500" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}