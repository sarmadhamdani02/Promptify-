import { useState } from 'react';
import axios from 'axios'
import { useSession } from 'next-auth/react';

const UploadPrompt = () => {
    const { data: session } = useSession();
    const user = session?.user;
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [prompt, setPrompt] = useState('');
    const username = user?.username

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Handle submit logic, like calling an API to save the prompt
        console.log("Prompt Submitted:", { username, description, title, prompt });


        try {
            console.log( username, description, title, prompt)
            const response = await axios.post('/api/uploadPromptGallery', { username, description, title, prompt});
            console.log("Prompt uploaded successfully:", response.data);
            setTitle('');
            setDescription('');
            setPrompt('');
        } catch (error) {
            console.error("UploadPrompt.tsx", " :: Error ❌ : ", error);
            // Show error message to the user
            alert("Failed to upload prompt");
        }


    };

    return (
        <div className="max-w-xl mx-auto mt-8 p-4 bg-blue-500 rounded-xl shadow-lg w-full">
            <h2 className="text-xl font-semibold text-white mb-4">Share Your Prompt</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-white">Title</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full mt-1 p-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 text-gray-700"
                        placeholder="Enter a title for your prompt"
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-white">Description</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full mt-1 p-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 text-gray-800"
                        placeholder="Provide a description for your prompt"
                        rows={2}
                    />
                </div>

                <div>
                    <label htmlFor="prompt" className="block text-sm font-medium text-white">Prompt</label>
                    <textarea
                        id="prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="w-full mt-1 p-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 text-gray-800"
                        placeholder="Enter your prompt here"
                        rows={3}
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-2 px-4 text-blue-500 font-semibold hover:text-white rounded-md hover:bg-blue-500 hover:border hover:border-white transition-all  focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
                >
                    Submit Prompt
                </button>
            </form>
        </div>
    );
};

export default UploadPrompt;
