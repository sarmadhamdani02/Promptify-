'use Client'


// auth/sign-in/page.tsx
import React, { useState } from "react";

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            setError("Both fields are required.");
            return;
        }

        // Here you can handle sign-in logic
        console.log("Signing in with", { email, password });
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
            <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
                <h2 className="text-3xl font-semibold text-center text-gray-700 mb-6">
                    Sign In
                </h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-gray-600">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="example@email.com"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-gray-600">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="********"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Sign In
                    </button>
                </form>
                <div className="mt-4 text-center text-sm text-gray-600">
                    <p>
                        Don't have an account?{" "}
                        <a href="/auth/sign-up" className="text-blue-500 hover:underline">
                            Sign Up
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
