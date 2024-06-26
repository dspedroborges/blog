"use client";

import { useFormState } from "react-dom";
import SubmitButton from "@/app/components/SubmitButton";
import { useRef, useState } from "react";
import { createPost } from "../../../components/actions/CreatePost";

export default function NovoPost() {
    const [fileUrl, setFileUrl] = useState<string | null>("");
    const [formState, action] = useFormState(createPost, {
        title: "",
        content: "",
        category: "",
        file: undefined,
        error: false,
        message: "",
    });

    const formRef = useRef<HTMLFormElement>(null);

    if (!formState.error && formState.message !== "") {
        formRef.current?.reset();
    }

    return (
        <>
            <h2 className="font-bold text-2xl text-center">Novo post</h2>
            <div className="h-1 bg-indigo-600 w-[100px] mx-auto my-4"></div>

            {
                formState.error ? (
                    <div className="text-red-600 my-4 text-center">{formState.message}</div>
                ) : (
                    <div className="text-green-600 my-4 text-center">{formState.message}</div>
                )
            }

            <form ref={formRef} defaultValue={formState.message} action={action} className="flex flex-col w-full lg:w-1/2 mx-auto">
                <label htmlFor="title" className="font-bold my-4">Título:</label>
                <input required type="text" id="title" name="title" className="py-4 px-2 rounded-xl border border-gray-400" />
                <label htmlFor="category" className="font-bold my-4">Categoria:</label>
                <input required type="text" name="category" id="category" className="py-4 px-2 rounded-xl border border-gray-400" />
                <label htmlFor="content" className="font-bold my-4">Conteúdo:</label>
                <textarea required id="content" name="content" className="p-2 rounded-xl border border-gray-400 min-h-[200px]"></textarea>
                <label htmlFor="file" className="font-bold my-4">Arquivo:</label>
                {
                    fileUrl && <img src={fileUrl} alt="Arquivo anexado" className="w-[250px] mx-auto my-4 rounded-xl border-4 border-orange-500" />
                }
                <input required type="file" id="file" className="py-4 px-2 rounded-xl border border-gray-400" name="file" />
                <SubmitButton name="Criar post" loadingName="Criando post..." />
            </form>
        </>
    )
}
