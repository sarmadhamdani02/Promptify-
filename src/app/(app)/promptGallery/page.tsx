"use client"

import { useEffect, useState } from 'react';
import { LucideIcon, Copy, ArrowUp, ArrowDown } from 'lucide-react';
// import Scrollbar from 'react-scrollbars-custom';
import { format } from "date-fns"
import { map } from 'zod';
import { useToast } from "@/hooks/use-toast"
import UploadPrompt from '@/components/UploadPrompt';
import { ActionIcon, CopyButton, Tooltip } from '@mantine/core';
import PromptGalleryModel from '../../../models/PromptGallery.model';
import { User } from "next-auth";
import { useSession } from 'next-auth/react';
import dbConnect from '@/lib/dbConnect';
import axios from 'axios';

console.log(`Prompt Gallery Model: ${PromptGalleryModel}`)


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

    const { data: session } = useSession();
    const user = session?.user;

    const { toast } = useToast()
    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const [promptUpVotes, setpromptUpVotes] = useState([]);

    const [isVoted, setisVoted] = useState(false)
    const [isDownVoted, setisDownVoted] = useState(false)
    const [uploadPromptComponent, setUploadPromptComponent] = useState(false)


    useEffect(() => {
        fetchPrompts().then((data) => {

            console.log(`Prompt Data from page: ${JSON.stringify(data.message, null, 2)}`)
            setPrompts(data.message);
        });
    }, []);

    useEffect(() => {
        prompts.map((data, index) => {
            setpromptUpVotes([...promptUpVotes, data?.upVotes]);

        })
        console.log("PromptUpvotes[]: ", promptUpVotes)
    }, [prompts, setPrompts]);

    const handleCopy = (prompt: string) => {
        navigator.clipboard.writeText(prompt);
        toast({
            title: "Copied!",
            description: "Prompt has been copied to your clipboard",
        });
    };

    const handleUpvote = async (id: string) => {
        try {
           
            const response = await axios.post('/api/upVotes', {
                
            })

            const data = await response.json();
            if (data.success) {
                console.log("✅ Upvote handled successfully");
                setPrompts((prev) =>
                    prev.map((p) =>
                        p._id === id
                            ? { ...p, upVotes: p.upVotes.includes(user?._id) ? p.upVotes.filter((u) => u !== user?._id) : [...p.upVotes, user?._id] }
                            : p
                    )
                );
            } else {
                console.error("❌ Error upvoting:", data.error);
            }
        } catch (error) {
            console.error("❌ Error in handleUpvote():", error);
        }
    };




    const handleDownvote = (id: string) => {
        console.log('downVoted:', id);

        setPrompts((prev) =>
            prev.map((data) =>
                data._id === id ? { ...data, downVotes: data.downVotes + 1 } : data
            )
        );
        console.log("handleDownvote: ", prompts)
    };


    return (
        <div className="bg-blue-50 min-h-screen p-8">
            <h1 className="text-center text-3xl font-semibold text-blue-500 mb-8">Prompt Gallery</h1>
            <div className=' flex flex-col items-center w-full gap-10  transition-all duration-500'>
                {uploadPromptComponent && <UploadPrompt />}
                <button onClick={() => { setUploadPromptComponent(!uploadPromptComponent) }} className={`bg-blue-500 rounded-lg transition-all duration-300 ${uploadPromptComponent ? "px-12" : "px-6"} py-3 hover:bg-blue-600`}>
                    {uploadPromptComponent ? "Hide" : "Upload your prompt"}
                </button>
            </div>
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
                                {format(new Date(prompt?.createdAt), "dd MMM yyyy")}
                            </span>
                        </p>


                        <div className="flex justify-between items-center mt-6">


                            <div className="flex space-x-4 justify-center items-center">
                                <button
                                    onClick={() => {
                                        handleUpvote(prompt?._id,)
                                    }}
                                    className="flex items-center space-x-2 text-green-500 p-2 rounded-md hover:bg-green-100"
                                >
                                    <ArrowUp className="h-5 w-5" />
                                </button>


                                <span className={`${(prompt.upVotes - prompt.downVotes) < 0 ? "text-red-500" : "text-blue-500"}  select-none font-semibold`}>{prompt.upVotes - prompt.downVotes}</span>

                                <button
                                    onClick={() => handleDownvote(prompt?._id)}
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
