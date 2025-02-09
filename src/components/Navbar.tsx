import React from "react";
import PromptifyLogo from "@/components/PromptifyLogo"; // Adjust the import path as needed
import { LogIn, LogOut, UserPlus2 } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AuroraText } from "@/components/magicui/aurora-text";
import { MorphingText } from "@/components/magicui/morphing-text";



const Navbar = () => {
    const { data: session } = useSession();
    const user = session?.user;

    // const texts = [

    //     `Welcome, ${user?.name}!`,
    //     `Hey, ${user?.name}!`,
    //     `Hi, ${user?.name}!`,
    //     `Hello, ${user?.name}!`,
    //     `Greetings, ${user?.name}!`,
    //     `Salam!, ${user?.name}!`,
    // ];

    return (
        <nav className="p-6 backdrop-blur-md bg-white/10 fixed w-full top-0 z-50">
            <div className="container mx-auto flex items-center justify-between">
                <div className="flex items-center">
                    <PromptifyLogo />
                </div>
                <div className="flex space-x-4">
                    {session ? (
                        <div className="flex items-center ">

                            {/* <MorphingText className=" text-sm text-nowrap" texts={texts} />; */}
                            <Button
                                className="flex items-center bg-red-500 hover:bg-red-700 text-white px-6 py-2 rounded-full font-semibold transition duration-300"
                                onClick={() => signOut()}
                            >
                                <LogOut className="mr-2 h-5 w-5" /> Log Out
                            </Button>
                        </div>
                    ) : (
                        <div className="flex space-x-4">
                            <a href="/sign-in" className="flex items-center bg-white text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-blue-100 transition duration-300">
                                <LogIn className="mr-2 h-5 w-5" /> Log In
                            </a>
                            <a href="/sign-up" className="flex items-center bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition duration-300">
                                <UserPlus2 className="mr-2 h-5 w-5" /> Sign Up
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
