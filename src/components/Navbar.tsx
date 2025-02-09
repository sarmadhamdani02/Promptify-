
'use client'

import React from 'react'
import { User } from 'next-auth'
import { useSession, signOut } from 'next-auth/react'
import { Button } from './ui/button'
import { LogOut, LogIn } from 'lucide-react';
import Link from 'next/link'
import { SparklesText } from './sparkles-text'
import { AuroraText } from "./magicui/aurora-text";


const Navbar = () => {

    const { data: session } = useSession();
    const user: User = session?.user;

    return (
        <nav className=' w-[90vw] absolute top-0 h-auto flex justify-end p-1 '>
            <div className=''>
                {session ? (
                    <div className=' flex justify-between items-center mt-3 px-10 w-[90vw]'>
                        <AuroraText className=' font-semibold '>{`@${user.username}`}</AuroraText>
                        <Button className=' bg-blue-500 hover:bg-blue-700' onClick={() => signOut()}><LogOut />Log Out</Button>
                    </div>
                ) : (
                    <Link href={"/sign-in"}>
                        <Button className=' bg-blue-500 hover:bg-blue-700'><LogIn />Log In</Button>
                    </Link>
                )
                }
            </div>
        </nav>
    )
}

export default Navbar