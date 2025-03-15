import React from "react";
import PromptifyLogo from "@/components/PromptifyLogo"; // Adjust path if needed
import { LogIn, UserPlus2, Zap, Sparkles, LayoutDashboard, ArrowRight, GalleryHorizontalEnd } from "lucide-react";

const App = () => {
  return (
    <div className="min-h-screen bg-blue-50 text-black">
      {/* Navbar */}
      <nav className="p-6 backdrop-blur-md bg-white/20 fixed w-full top-0 z-50 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <PromptifyLogo />
          </div>
          <div className="flex space-x-4">
            <a
              href="/sign-in"
              className="flex items-center bg-white text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-blue-100 transition duration-300 shadow-md"
            >
              <LogIn className="mr-2 h-5 w-5" />
              Log In
            </a>
            <a
              href="/sign-up"
              className="flex items-center bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition duration-300 shadow-md"
            >
              <UserPlus2 className="mr-2 h-5 w-5" />
              Sign Up
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-44 text-center">
        <h1 className="text-6xl font-extrabold mb-6 bg-gradient-to-r from-black to-blue-800 text-transparent bg-clip-text animate-fade-in">
          Transform Your Prompts into <br /> Powerful AI Inputs
        </h1>
        <p className="text-lg text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
          Promptify enhances your input to generate better results with AI. Whether you're crafting prompts for ChatGPT, MidJourney, or any AI model, we help make your inputs <b>smarter, clearer, and more effective </b>.
        </p>
        <div className="flex justify-center space-x-4">
          <a
            href="/tryPromptify"
            className="flex items-center bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition duration-300 shadow-md"
          >
            Try Right Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20 text-black">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">
            Why Choose <span className="text-blue-600">Promptify</span>?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center p-8 bg-blue-50 border border-blue-200 rounded-lg hover:shadow-lg hover:border-blue-400 transition duration-300">
              <Zap className="h-12 w-12 mx-auto mb-4 text-blue-600" />
              <h3 className="text-xl font-semibold mb-4">Enhanced Prompts</h3>
              <p className="text-gray-600">Turn simple inputs into structured, AI-friendly prompts for **superior responses**.</p>
            </div>
            <div className="text-center p-8 bg-blue-50 border border-blue-200 rounded-lg hover:shadow-lg hover:border-blue-400 transition duration-300">
              <Sparkles className="h-12 w-12 mx-auto mb-4 text-blue-600" />
              <h3 className="text-xl font-semibold mb-4">Seamless Integration</h3>
              <p className="text-gray-600">Works **flawlessly** with OpenAI, MidJourney, Stable Diffusion, and more.</p>
            </div>
            <div className="text-center p-8 bg-blue-50 border border-blue-200 rounded-lg hover:shadow-lg hover:border-blue-400 transition duration-300">
              <LayoutDashboard className="h-12 w-12 mx-auto mb-4 text-blue-600" />
              <h3 className="text-xl font-semibold mb-4">User-Friendly</h3>
              <p className="text-gray-600">Designed for both **beginners & experts**, making AI more **accessible**.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Prompt Gallery Section */}
      <section className="bg-gradient-to-r from-blue-800 to-black py-20 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Explore the <span className="text-yellow-400">Prompt Gallery</span></h2>
          <p className="text-lg mb-8 max-w-3xl mx-auto">
            Browse, contribute, and vote on the **best AI prompts** shared by the community.
          </p>
          <div className="flex justify-center">
            <a
              href="/promptGallery"
              className="inline-flex items-center bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-100 transition duration-300 shadow-md"
            >
              <GalleryHorizontalEnd className="mr-2 h-6 w-6" />
              Visit the Gallery
            </a>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-gradient-to-r from-black to-blue-800 py-20 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Supercharge Your AI Workflow</h2>
          <p className="text-lg mb-8 max-w-3xl mx-auto">
            Join **thousands of creators, marketers, and developers** who are optimizing their AI-generated content with **Promptify**.
          </p>
          <a
            href="/sign-up"
            className="inline-flex items-center bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition duration-300 shadow-md"
          >
            <UserPlus2 className="mr-2 h-5 w-5" />
            Sign Up Now
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900/80 backdrop-blur-md py-10 text-white">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; {new Date().getFullYear()} Promptify. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
