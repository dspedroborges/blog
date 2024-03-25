"use client";

import { useSession } from "next-auth/react"

export default function Layout({ children }: { children: React.ReactNode }) {
    const session = useSession();

    if (session.status !== "authenticated") {
        return <>Não autenticado</>;
    }

    return (
        <div className="pt-12">
            {children}
        </div>
    )
}