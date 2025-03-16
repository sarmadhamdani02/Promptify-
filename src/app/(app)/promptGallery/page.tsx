"use client";

import { useEffect, useState } from "react";
import { Copy, ArrowUp, ArrowDown, Loader } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import axios from "axios";
import PromptGalleryLogo from "@/components/PromptGalleryLogo";
import Navbar from "@/components/Navbar";

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

    // ✅ Handle Upvote & Downvote
    const handleVote = async (promptId: string, type: "up" | "down") => {
        if (!user?._id) {
            toast({ title: "Login Required", description: "You must be logged in to vote.", variant: "destructive" });
            return;
        }

        try {
            await axios.post(type === "up" ? "/api/upVotes" : "/api/downVote", {
                id: promptId,
                userId: user._id,
            });

            // ✅ Fix: Ensure downvote removes upvote & vice versa
            setPrompts((prev) =>
                prev.map((p) =>
                    p._id === promptId
                        ? {
                            ...p,
                            upVotes: type === "up"
                                ? p.upVotes.includes(user._id)
                                    ? p.upVotes.filter((id) => id !== user._id)
                                    : [...p.upVotes, user._id]
                                : p.upVotes.filter((id) => id !== user._id), // Remove upvote on downvote

                            downVotes: type === "down"
                                ? p.downVotes.includes(user._id)
                                    ? p.downVotes.filter((id) => id !== user._id)
                                    : [...p.downVotes, user._id]
                                : p.downVotes.filter((id) => id !== user._id), // Remove downvote on upvote
                        }
                        : p
                )
            );
        } catch () {
            toast({ title: "Vote Failed", description: "Something went wrong. Try again.", variant: "destructive" });
        }
    };


    return (
        <div>
            <Navbar />
            <div className="bg-blue-50 min-h-screen p-8">
                <div className="flex flex-col items-center w-full gap-6 transition-all duration-500 mt-20">
                    <PromptGalleryLogo className="scale-110" />
                    <button
                        onClick={() => setUploadPromptComponent(true)}
                        className="bg-blue-500 text-lg font-semibold rounded-lg transition-all duration-300 px-8 py-3 hover:bg-blue-600 text-white shadow-md"
                    >
                        + Upload Your Prompt
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader className="animate-spin h-12 w-12 text-blue-500" />
                    </div>
                ) : (
                    <div className="flex flex-col gap-6 p-12">
                        {prompts.map((prompt) => {
                            const isUpvoted = prompt.upVotes.includes(user?._id);
                            const isDownvoted = prompt.downVotes.includes(user?._id);
                            const voteDifference = prompt.upVotes.length - prompt.downVotes.length;

                            return (
                                <div key={prompt._id} className="bg-white hover:shadow-lg transition rounded-[30px] overflow-hidden p-6 border border-blue-500">
                                    <h2 className="text-xl font-bold text-black">{prompt.title}</h2>
                                    <p className="text-xs text-gray-500">@{prompt.username}</p>
                                    <p className="text-gray-700 text-sm mt-2">{prompt.description}</p>

                                    <div className="bg-blue-50 rounded-2xl mt-4 flex justify-between py-2 px-3">
                                        <p className="text-gray-800 whitespace-pre-line max-h-32 overflow-y-auto px-3 py-6">{prompt.prompt}</p>
                                        <button onClick={() => handleCopy(prompt.prompt)} className="text-blue-500 flex items-center space-x-2 p-2 rounded-md hover:bg-blue-100">
                                            <Copy className="h-5 w-5" />
                                            <span>Copy</span>
                                        </button>
                                    </div>

                                    {/* ✅ Like/Dislike UI (Left) + Date (Right) */}
                                    <div className="flex items-center justify-between mt-4">
                                        {/* ✅ Left - Like/Dislike Buttons */}
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => handleVote(prompt._id, "up")}
                                                className={`p-2 rounded-md ${isUpvoted ? "bg-green-100" : "hover:bg-green-100"}`}
                                            >
                                                <ArrowUp className="text-green-500" />
                                            </button>

                                            {/* ✅ Vote Count Coloring Logic */}
                                            <span
                                                className={`text-lg font-semibold ${voteDifference === 0
                                                        ? "text-blue-500"
                                                        : voteDifference > 0
                                                            ? "text-green-500"
                                                            : "text-red-500"
                                                    }`}
                                            >
                                                {voteDifference}
                                            </span>

                                            <button
                                                onClick={() => handleVote(prompt._id, "down")}
                                                className={`p-2 rounded-md ${isDownvoted ? "bg-red-100" : "hover:bg-red-100"}`}
                                            >
                                                <ArrowDown className="text-red-500" />
                                            </button>
                                        </div>

                                        {/* ✅ Right - Date Posted */}
                                        <p className="text-xs text-gray-500">
                                            Posted on {format(new Date(prompt.createdAt), "dd MMM yyyy")}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
