"use client";

import { useFormState } from "react-dom";
import SubmitButton from "@/app/components/SubmitButton";
import { useRef, useState } from "react";
import { editPost } from "./actions/EditPost";
import { deletePost } from "./actions/DeletePost";

export default function EditPostPage({ postData }: { postData: Record<string, string | any> | null }) {
    const [fileUrl, setFileUrl] = useState<string | null>("");
    const [formState, action] = useFormState(editPost, {
        title: "",
        content: "",
        category: "",
        file: undefined,
        error: false,
        message: "",
    });
    const [deleteFormState, deleteAction] = useFormState(deletePost, {
        error: false,
        message: "",
    } as any);

    const formRef = useRef<HTMLFormElement>(null);

    if (!formState.error && formState.message !== "") {
        formRef.current?.reset();
    }

    console.log(deleteFormState);

    return (
        <>
            <h2 className="font-bold text-2xl text-center">Editar post</h2>
            <div className="h-1 bg-indigo-600 w-[100px] mx-auto my-4"></div>

            {
                formState.error ? (
                    <div className="text-red-600 my-4 text-center">{formState.message}</div>
                ) : (
                    <div className="text-green-600 my-4 text-center">{formState.message}</div>
                )
            }

            <form ref={formRef} defaultValue={formState.message} action={action} className="flex flex-col w-full lg:w-1/2 mx-auto">
                <input type="hidden" name="currentFileName" value={postData?.file} />
                <input type="hidden" name="postId" value={postData?.id} />
                <label htmlFor="title" className="font-bold my-4">Título:</label>
                <input required defaultValue={postData?.title} type="text" id="title" name="title" className="py-4 px-2 rounded-xl border border-gray-400" />
                <label htmlFor="category" className="font-bold my-4">Categoria:</label>
                <input required defaultValue={postData?.category} type="text" name="category" id="category" className="py-4 px-2 rounded-xl border border-gray-400" />
                <label htmlFor="content" className="font-bold my-4">Conteúdo:</label>
                <textarea required defaultValue={postData?.content} id="content" name="content" className="p-2 rounded-xl border border-gray-400 min-h-[200px]"></textarea>
                <label htmlFor="currentFile" className="font-bold my-4">Arquivo atual:</label>
                <img src={`/assets/${postData?.file}`} alt="Arquivo do post atual" className="w-[300px]" />
                <label htmlFor="file" className="font-bold my-4">Novo arquivo:</label>
                {
                    fileUrl && <img src={fileUrl} alt="Arquivo anexado" className="w-[250px] mx-auto my-4 rounded-xl border-4 border-orange-500" />
                }
                <input required type="file" id="file" className="py-4 px-2 rounded-xl border border-gray-400" name="file" />
                <SubmitButton name="Editar post" loadingName="Editando post..." />
            </form>
        </>
    )
}
