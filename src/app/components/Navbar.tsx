"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { BsHouse, BsPlusCircle } from "react-icons/bs";

export default function Navbar() {
    const session = useSession();
    const username = session.data?.user?.name;
    if (session.status !== "authenticated") {
        return;
    }

    return (
        <nav className="fixed top-0 left-0 w-full bg-indigo-600 text-white p-2 min-h-[50px] flex items-center justify-around">
            <span className="font-bold">Bem vindo, {username}!</span>
            <ul className="flex items-center justify-around w-2/3">
                <li>
                    <Link href="/posts" className="hover:underline"><BsHouse className="inline text-xl mr-1" /> Início</Link>
                </li>
                {
                    username === "admin" && (
                        <li>
                            <Link href="/admin/post/novo" className="hover:underline"><BsPlusCircle className="inline text-xl mr-1" /> Novo post</Link>
                        </li>
                    )
                }

            </ul>

            <button onClick={() => signOut()} className="font-bold">Sair</button>
        </nav>
    )
}