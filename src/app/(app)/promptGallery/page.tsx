"use client"

import { useEffect, useState } from 'react';
import { LucideIcon, Copy, ThumbUp, ThumbDown } from 'lucide-react';

interface Prompt {
    username: string;
    description: string;
    title: string;
    prompt: string;
    upVotes: number;
    downVotes: number;
}

const fetchPrompts = async () => {
    const response = await fetch('/api/getPromptsGallery'); // Ensure you have this API route in your Next.js API
    const data = await response.json();
    return data;
};

export default function PromptGallery() {
    const [prompts, setPrompts] = useState<Prompt[]>([]);

    useEffect(() => {
        fetchPrompts().then((data) => {
            setPrompts(data);
        });
    }, []);

    const handleCopy = (prompt: string) => {
        navigator.clipboard.writeText(prompt);
        alert('Prompt copied to clipboard!');
    };

    const handleUpvote = (id: string) => {
        // Handle upvote logic
        console.log('Upvoted:', id);
    };

    const handleDownvote = (id: string) => {
        // Handle downvote logic
        console.log('Downvoted:', id);
    };

    return (
        <div className="bg-blue-50 min-h-screen p-8">
            <h1 className="text-center text-3xl font-semibold text-blue-500 mb-8">Prompt Gallery</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {prompts.map((prompt, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-lg shadow-lg overflow-hidden p-6"
                    >
                        <h2 className="text-xl font-bold text-blue-500">{prompt.title}</h2>
                        <p className="text-sm text-gray-500 mt-2">@{prompt.username}</p>
                        <p className="text-gray-700 mt-4">{prompt.description}</p>
                        <p className="text-gray-600 mt-4">{prompt.prompt}</p>

                        <div className="flex justify-between items-center mt-6">
                            <button
                                onClick={() => handleCopy(prompt.prompt)}
                                className="text-blue-500 flex items-center space-x-2 p-2 rounded-md hover:bg-blue-100"
                            >
                                <Copy className="h-5 w-5" />
                                <span>Copy</span>
                            </button>

                            <div className="flex space-x-4">
                                <button
                                    onClick={() => handleUpvote(prompt.username)}
                                    className="flex items-center space-x-2 text-green-500 p-2 rounded-md hover:bg-green-100"
                                >
                                    <ThumbUp className="h-5 w-5" />
                                    <span>{prompt.upVotes}</span>
                                </button>

                                <button
                                    onClick={() => handleDownvote(prompt.username)}
                                    className="flex items-center space-x-2 text-red-500 p-2 rounded-md hover:bg-red-100"
                                >
                                    <ThumbDown className="h-5 w-5" />
                                    <span>{prompt.downVotes}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
