"use client";

import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { FormEvent, useState } from "react";

export default function NovoPost() {
    const [formData, setFormData] = useState<Record<string, string>>({});
    const mutatePost = useMutation({
        mutationFn: async (data: typeof formData) => {
            const response = await fetch("/api/post", {
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
        try {
            mutatePost.mutate(formData);
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <>
            <h2 className="font-bold text-2xl text-center">Novo post</h2>
            <div className="h-1 bg-indigo-600 w-[100px] mx-auto my-4"></div>
            <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col w-full lg:w-1/2 mx-auto">
                <label htmlFor="title" className="font-bold my-4">Título:</label>
                <input required type="text" id="title" className="py-4 px-2 rounded-xl border border-gray-400" onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                <label htmlFor="category" className="font-bold my-4">Categoria:</label>
                <input required type="text" id="category" className="py-4 px-2 rounded-xl border border-gray-400" onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
                <label htmlFor="content" className="font-bold my-4">Conteúdo:</label>
                <textarea required id="content" className="p-2 rounded-xl border border-gray-400 min-h-[200px]" onChange={(e) => setFormData({ ...formData, content: e.target.value })}></textarea>
                <button className="bg-gray-100 text-black p-2 rounded-xl border border-gray-400 my-8 hover:bg-indigo-600 hover:text-white transition-all w-1/3 self-end">Enviar</button>

                {
                    (!mutatePost.data?.error && mutatePost?.data?.id) && (
                        <div>
                            <div>Sucesso.</div>
                            <Link href={`/admin/post/arquivo?postId=${mutatePost.data.id}`}>Clique aqui para continuar.</Link>
                        </div>
                    )
                }

            </form>
        </>
    )
}
