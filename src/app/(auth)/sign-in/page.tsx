
'use client';

import { useSession, signIn, signOut } from "next-auth/react"


export default function SignInPage() {
  const { data: session } = useSession()

  if (session) {
    return (
      <div>
        Signed in as {session.user.email} <br />
        <button className="bg-pink-500" onClick={() => signOut()}>Sign out</button>
      </div>
    )
  }

  return (
    <div>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </div>
  )
}
