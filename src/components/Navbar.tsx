import React, { useState } from "react";
import PromptifyLogo from "@/components/PromptifyLogo";
import { LogIn, LogOut, UserPlus2, FilePlus, GalleryHorizontalEnd, MessageSquare, Home } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Menu as MantineMenu, Burger } from "@mantine/core";
import { usePathname } from "next/navigation";

const Navbar = () => {
    const { data: session } = useSession();
    const user = session?.user;
    const [menuOpened, setMenuOpened] = useState(false);
    const pathname = usePathname(); // ✅ Get current route

    // ✅ Navigation items with icons
    const menuItems = [
        { name: "Generate Prompt", href: "/home", icon: <FilePlus className="h-5 w-5" /> },
        { name: "Prompt Gallery", href: "/promptGallery", icon: <GalleryHorizontalEnd className="h-5 w-5" /> },
        { name: "Feedback", href: "/feedback", icon: <MessageSquare className="h-5 w-5" /> },
    ];

    return (
        <nav className="px-4 py-2 md:p-6 fixed w-full top-0 z-50 bg-white/10 backdrop-blur-lg shadow-lg rounded-b-lg">
            <div className="container mx-auto flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center">
                    <PromptifyLogo />
                </div>

                {/* ✅ Glassmorphism Hamburger Menu */}
                <MantineMenu opened={menuOpened} onChange={setMenuOpened} position="bottom-end">
                    <MantineMenu.Target>
                        <Burger
                            opened={menuOpened}
                            onClick={() => setMenuOpened(!menuOpened)}
                            className="p-2 rounded-md text-gray-800 bg-white/20 backdrop-blur-md hover:bg-white/30 transition duration-300"
                        />
                    </MantineMenu.Target>

                    {/* ✅ Improved Dropdown UI with Glassmorphism */}
                    <MantineMenu.Dropdown className="p-2 rounded-lg shadow-xl bg-white/20 backdrop-blur-md w-48 border border-white/30">
                        {session ? (
                            <>
                                {/* ✅ Filter out current screen from menu */}
                                {menuItems
                                    .filter((item) => item.href !== pathname)
                                    .map((item) => (
                                        <MantineMenu.Item
                                            key={item.name}
                                            component={Link}
                                            href={item.href}
                                            icon={item.icon}
                                            className="px-4 py-2 rounded-lg flex items-center gap-2 text-gray-800 hover:bg-blue-500 hover:text-white transition duration-300"
                                        >
                                            {item.name}
                                        </MantineMenu.Item>
                                    ))}

                                <MantineMenu.Divider />

                                <MantineMenu.Item
                                    onClick={() => signOut()}
                                    color="red"
                                    icon={<LogOut className="h-5 w-5" />}
                                    className="px-4 py-2 rounded-lg flex items-center gap-2 text-red-500 hover:bg-red-500 hover:text-white transition duration-300"
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
                                    className="px-4 py-2 rounded-lg flex items-center gap-2 text-gray-800 hover:bg-blue-500 hover:text-white transition duration-300"
                                >
                                    Log In
                                </MantineMenu.Item>
                                <MantineMenu.Item
                                    component={Link}
                                    href="/sign-up"
                                    icon={<UserPlus2 className="h-5 w-5" />}
                                    className="px-4 py-2 rounded-lg flex items-center gap-2 text-gray-800 hover:bg-blue-500 hover:text-white transition duration-300"
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
