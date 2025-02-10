import React from "react";
import PromptifyLogo from "@/components/PromptifyLogo"; // Adjust the import path as needed
import { LogIn, UserPlus2, Zap, Sparkles, LayoutDashboard, ArrowRight } from "lucide-react";

const App = () => {
  return (
    <div className="min-h-screen bg-blue-50 text-black">
      {/* Navbar */}
      <nav className="p-6 backdrop-blur-md bg-white/10 fixed w-full top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <PromptifyLogo />
          </div>
          <div className="flex space-x-4">
            <a
              href="/sign-in"
              className="flex items-center bg-white text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-blue-100 transition duration-300"
            >
              <LogIn className="mr-2 h-5 w-5" />
              Log In
            </a>
            <a
              href="/sign-up"
              className="flex items-center bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition duration-300"
            >
              <UserPlus2 className="mr-2 h-5 w-5" />
              Sign Up
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-40 text-center">
        <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-black to-blue-800 text-transparent bg-clip-text">
          Transform Your Prompts into <br /> Powerful AI Inputs
        </h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Promptify enhances your input to deliver better results with any GPT model. Make your AI interactions smarter, faster, and more efficient.
        </p>
        <div className="flex justify-center space-x-4">
          <a
            href="/tryPromptify"
            className="flex items-center bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition duration-300"
          >
            Try Right Now 
            <ArrowRight  className="ml-2 h-5 w-5" />
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20 text-black">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose <span className="text-blue-600">Promptify</span>?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-blue-50 border border-blue-200 rounded-lg hover:shadow-lg hover:border-blue-400 transition duration-300">
              <Zap className="h-12 w-12 mx-auto mb-4 text-blue-600" />
              <h3 className="text-xl font-semibold mb-4">Enhanced Prompts</h3>
              <p>Turn simple inputs into detailed, AI-friendly prompts for better results.</p>
            </div>
            <div className="text-center p-8 bg-blue-50 border border-blue-200 rounded-lg hover:shadow-lg hover:border-blue-400 transition duration-300">
              <Sparkles className="h-12 w-12 mx-auto mb-4 text-blue-600" />
              <h3 className="text-xl font-semibold mb-4">Seamless Integration</h3>
              <p>Works with any GPT model, ensuring compatibility and ease of use.</p>
            </div>
            <div className="text-center p-8 bg-blue-50 border border-blue-200 rounded-lg hover:shadow-lg hover:border-blue-400 transition duration-300">
              <LayoutDashboard className="h-12 w-12 mx-auto mb-4 text-blue-600" />
              <h3 className="text-xl font-semibold mb-4">User-Friendly</h3>
              <p>Designed for both beginners and advanced users, making AI accessible to everyone.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-black to-blue-800 py-20 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Supercharge Your AI Workflow?
          </h2>
          <p className="text-xl mb-8">
            Join thousands of users who are already transforming their prompts with Promptify.
          </p>
          <a
            href="/sign-up"
            className="inline-flex items-center bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition duration-300"
          >
            <UserPlus2 className="mr-2 h-5 w-5" />
            Sign Up Now
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900/80 backdrop-blur-md py-10 text-white">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; 2023 Promptify. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;