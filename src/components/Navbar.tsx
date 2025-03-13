import React, { useState } from "react";
import PromptifyLogo from "@/components/PromptifyLogo"; // Adjust the import path as needed
import { LogIn, LogOut, UserPlus2, FilePlus, GalleryHorizontalEnd, MessageSquare, Menu } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu as MantineMenu, Burger } from "@mantine/core";

const Navbar = () => {
    const { data: session } = useSession();
    const user = session?.user;
    const [menuOpened, setMenuOpened] = useState(false);

    return (
        <nav className="p-6 backdrop-blur-md bg-white/10 fixed w-full top-0 z-50">
            <div className="container mx-auto flex items-center justify-between">
                <div className="flex items-center">
                    <PromptifyLogo />
                </div>
                <MantineMenu opened={menuOpened} onChange={setMenuOpened} position="bottom-end">
                    <MantineMenu.Target>
                        <Burger
                            opened={menuOpened}
                            onClick={() => setMenuOpened(!menuOpened)}
                            className="blur-500 p-2 rounded-full hover:text-white hover:bg-blue-500 transition duration-300"
                        />
                    </MantineMenu.Target>
                    <MantineMenu.Dropdown className="p-2 rounded-lg shadow-lg bg-white">
                        {session ? (
                            <>
                                <MantineMenu.Item
                                    component={Link}
                                    href="/home"
                                    icon={<FilePlus className="h-5 w-5" />}
                                    className="px-4 py-2 rounded-lg hover:bg-blue-500 hover:text-white transition duration-300"
                                >
                                    Generate Prompt
                                </MantineMenu.Item>
                                <MantineMenu.Item
                                    component={Link}
                                    href="/promptGallery"
                                    icon={<GalleryHorizontalEnd className="h-5 w-5" />}
                                    className="px-4 py-2 rounded-lg hover:bg-blue-500 hover:text-white transition duration-300"
                                >
                                    Prompt Gallery
                                </MantineMenu.Item>
                                <MantineMenu.Item
                                    component={Link}
                                    href="/feedback"
                                    icon={<MessageSquare className="h-5 w-5" />}
                                    className="px-4 py-2 rounded-lg hover:bg-blue-500 hover:text-white transition duration-300"
                                >
                                    Feedback
                                </MantineMenu.Item>
                                <MantineMenu.Item
                                    onClick={() => signOut()}
                                    color="red"
                                    icon={<LogOut className="h-5 w-5" />}
                                    className="px-4 py-2 rounded-lg hover:bg-red-500 hover:text-white transition duration-300"
                                >
                                    Log Out
                                </MantineMenu.Item>
                            </>
                        ) : (
                            <>
                                <MantineMenu.Item
                                    component={Link}
                                    href="/sign-in"
                                    icon={<LogIn className="h-5 w-5" />}
                                    className="px-4 py-2 rounded-lg hover:bg-blue-500 hover:text-white transition duration-300"
                                >
                                    Log In
                                </MantineMenu.Item>
                                <MantineMenu.Item
                                    component={Link}
                                    href="/sign-up"
                                    icon={<UserPlus2 className="h-5 w-5" />}
                                    className="px-4 py-2 rounded-lg hover:bg-blue-500 hover:text-white transition duration-300"
                                >
                                    Sign Up
                                </MantineMenu.Item>
                            </>
                        )}
                    </MantineMenu.Dropdown>
                </MantineMenu>
            </div>
        </nav>
    );
};

export default Navbar;
