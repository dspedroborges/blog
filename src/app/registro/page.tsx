"use client";

import { useMutation } from "@tanstack/react-query";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { FormEvent, useState } from "react";

export default function Registro() {
    const [formData, setFormData] = useState<Record<string, string>>({});
    const session = useSession();
    
    const mutateRegistration = useMutation({
        mutationFn: async (data: typeof formData) => {
            const response = await fetch("/api/user", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })

            return response.json()
        }
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        console.log(formData);

        try {
            mutateRegistration.mutate(formData);
        } catch (e) {
            console.log(e);
        }
    }

    if (session.status === "authenticated") {
        return (
          <div className="flex flex-col items-center justify-center my-8">
            <button onClick={() => signOut()} className="bg-red-600 text-white rounded-xl p-2 mb-2 hover:bg-red-700">Logout</button>
            <div>Já autenticado.</div>
          </div>
        )
      }

    return (
        <>
            <Link href="/" className="block my-8 text-center hover:underline text-indigo-600">Já tenho conta</Link>
            <h2 className="font-bold text-2xl text-center">Registro de usuário</h2>
            <div className="h-1 bg-indigo-600 w-[100px] mx-auto my-4"></div>
            <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col w-full lg:w-1/2 mx-auto">
                <label htmlFor="title" className="font-bold my-4">Nome de usuário: <span className="text-xs text-red-500">*</span></label>
                <input required type="text" id="title" className="py-4 px-2 rounded-xl border border-gray-400" onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
                <label htmlFor="email" className="font-bold my-4">Email: <span className="text-xs text-red-500">*</span></label>
                <input required type="text" id="email" className="py-4 px-2 rounded-xl border border-gray-400" onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                <label htmlFor="password" className="font-bold my-4">Senha: <span className="text-xs text-red-500">*</span></label>
                <input required type="password" id="password" className="py-4 px-2 rounded-xl border border-gray-400" onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                <label htmlFor="passwordConfirmation" className="font-bold my-4">Confirmação de senha: <span className="text-xs text-red-500">*</span></label>
                <input required type="password" id="passwordConfirmation" className="py-4 px-2 rounded-xl border border-gray-400" onChange={(e) => setFormData({ ...formData, passwordConfirmation: e.target.value })} />
                <button className="bg-gray-100 text-black p-2 rounded-xl border border-gray-400 my-8 hover:bg-indigo-600 hover:text-white transition-all w-1/3 self-end">Enviar</button>

                {
                    (!mutateRegistration.data?.error && mutateRegistration?.data?.id) && (
                        <div>
                            <div>Sucesso.</div>
                        </div>
                    )
                }

            </form>
        </>
    )
}