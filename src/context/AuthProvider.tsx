'use Client'

import { SessionProvider } from "next-auth/react"

export default function AuthProvider({ childeren, }: { childeren: React.ReactNode }) {
    return (
        <SessionProvider>
            {childeren}
        </SessionProvider>
    )
}

