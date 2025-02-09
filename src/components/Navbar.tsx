
'use client'

import React from 'react'
import { User } from 'next-auth'
import { useSession, signOut } from 'next-auth/react'
import { Button } from './ui/button'
import { LogOut, LogIn } from 'lucide-react';
import Link from 'next/link'


const Navbar = () => {

    const { data: session } = useSession();
    const user: User = session?.user;

    return (
        <nav className=' w-full absolute top-0 h-auto flex items-center justify-end p-1 '>
            <div className=''>
                {session ? (
                    <>
                        <h1>Welcome {user.name}</h1>
                        <Button className=' bg-blue-500 hover:bg-blue-700' onClick={() => signOut()}><LogOut />Log Out</Button>
                    </>
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