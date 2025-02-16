"use client"

import { useEffect, useState } from 'react';
import { LucideIcon, Copy, ArrowUp, ArrowDown } from 'lucide-react';
// import Scrollbar from 'react-scrollbars-custom';
import { format } from "date-fns"

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
    const [prompts, setPrompts] = useState<Prompt[]>([]); // Default to an empty array


    useEffect(() => {
        fetchPrompts().then((data) => {

            console.log(`Prompt Data from page: ${JSON.stringify(data.message, null, 2)}`)
            setPrompts(data.message);
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
            <div className="flex flex-col gap-6  p-12">
                {prompts.map((prompt, index) => (
                    <div
                        key={index}
                        className="bg-white hover:shadow-lg transition rounded-[30px] overflow-hidden p-6 border border-blue-500 border[1px]"
                    >
                        <div className=' flex flex-col justify-center h-auto '>
                            <h2 className="text-xl font-bold text-black">{prompt.title}</h2>
                            <p className="text-xs text-gray-500 hover:underline cursor-pointer">@{prompt.username}</p>

                            <p className="text-gray-700 text-sm mt-2 ">{prompt?.description}</p>
                        </div>
                        <div className=" bg-blue-50  rounded-2xl mt-4 flex justify-between py-2 px-3">
                            <p className=' text-gray-800 whitespace-pre-line  max-h-32 overflow-y-auto px-3 py-6'>{prompt.prompt}</p>
                            <button
                                onClick={() => handleCopy(prompt.prompt)}
                                className="text-blue-500 flex items-center space-x-2 p-2 rounded-md hover:bg-blue-100 "
                            >
                                <Copy className="h-5 w-5" />
                                <span>Copy</span>
                            </button>
                        </div>

                        <p className="text-xs text-gray-400 hover:underline cursor-pointer mt-4">Posted at{" "}
                            <span className=' text-gray-400 '>
                                {format(new Date(prompt.createdAt), "dd MM yyyy")}
                            </span>
                        </p>


                        <div className="flex justify-between items-center mt-6">


                            <div className="flex space-x-4 justify-center items-center">
                                <button
                                    onClick={() => {
                                        prompt.upVotes++
                                        handleUpvote(prompt?._id)
                                    }}
                                    className="flex items-center space-x-2 text-green-500 p-2 rounded-md hover:bg-green-100"
                                >
                                    <ArrowUp className="h-5 w-5" />
                                </button>


                                <span className={`${(prompt.upVotes - prompt.downVotes) < 0 ? "text-red-500" : "text-blue-500"}  select-none font-semibold`}>{prompt.upVotes - prompt.downVotes}</span>

                                <button
                                    onClick={() => handleDownvote(prompt.username)}
                                    className="flex items-center space-x-2 text-red-500 p-2 rounded-md hover:bg-red-100"
                                >
                                    <ArrowDown className="h-5 w-5" />
                                </button>
                            </div>

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
