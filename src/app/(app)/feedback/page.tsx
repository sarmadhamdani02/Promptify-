"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { Loader } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useSession } from "next-auth/react";

export default function FeedbackPage() {
    const { data: session } = useSession();
    const user = session?.user;
    const { toast } = useToast();

    // ✅ Auto-fill Name & Email
    const [name, setName] = useState(user?.username || "");
    const [email, setEmail] = useState(user?.email || "");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [canSubmit, setCanSubmit] = useState(true);
    const [timeLeft, setTimeLeft] = useState<number | null>(null); // Time left in seconds

    // ✅ Check if 10 minutes have passed
    useEffect(() => {
        if (user) {
            setName(user.username || "");
            setEmail(user.email || "");

            const lastFeedbackTime = localStorage.getItem("lastFeedbackTime");
            if (lastFeedbackTime) {
                const elapsedTime = Date.now() - parseInt(lastFeedbackTime);
                const remainingTime = 10 * 60 * 1000 - elapsedTime;
                if (remainingTime > 0) {
                    setCanSubmit(false);
                    setTimeLeft(Math.floor(remainingTime / 1000)); // Convert to seconds
                }
            }
        }
    }, [user]);

    // ✅ Countdown Timer
    useEffect(() => {
        if (timeLeft !== null && timeLeft > 0) {
            const interval = setInterval(() => {
                setTimeLeft((prev) => (prev !== null ? prev - 1 : null));
            }, 1000);
            return () => clearInterval(interval);
        } else {
            setCanSubmit(true);
        }
    }, [timeLeft]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSubmit) return;

        setLoading(true);
        try {
            await axios.post("/api/feedback", { name, email, message });

            toast({
                title: "Feedback Sent! ✅",
                description: "Thank you for your feedback! You can send another after 10 minutes.",
            });

            setMessage("");
            setCanSubmit(false);
            setTimeLeft(10 * 60); // Set 10-minute cooldown in seconds
            localStorage.setItem("lastFeedbackTime", Date.now().toString());
        } catch (error) {
            toast({
                title: "Submission Failed ❌",
                description: "Something went wrong. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
            <Navbar />
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-2xl font-bold text-gray-800 text-center">Feedback Form</h2>
                <p className="text-gray-600 text-center mt-2">We'd love to hear from you!</p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    {/* Name (Auto-filled & Locked) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            value={name}
                            readOnly
                            className="w-full p-2 border border-gray-300 rounded-md bg-gray-200 cursor-not-allowed"
                        />
                    </div>

                    {/* Email (Auto-filled but Editable) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    {/* Message Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Message</label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Your feedback..."
                            rows={4}
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading || !canSubmit}
                        className={`w-full py-2 px-4 text-white font-semibold rounded-md transition-all focus:ring-2 focus:ring-blue-500 ${
                            canSubmit ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"
                        }`}
                    >
                        {loading ? <Loader className="animate-spin mx-auto" /> : "Send Feedback"}
                    </button>

                    {!canSubmit && timeLeft !== null && (
                        <p className="text-red-500 text-sm text-center mt-2">
                            ❌ You can send feedback again in {Math.floor(timeLeft / 60)}m {timeLeft % 60}s.
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
}
