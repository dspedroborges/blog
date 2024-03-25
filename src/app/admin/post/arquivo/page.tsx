"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

export default function FileDefinition() {
    const [fileInput, setFileInput] = useState<File>();
    const [fileUrl, setFileUrl] = useState<string | null>("");
    const searchParams = useSearchParams();
    const postId = searchParams.get("postId");

    console.log(postId);

    const mutateFile = useMutation({
        mutationFn: async (data: FormData) => {
            const response = await fetch(`/api/upload?postId=${postId}&fileName=${new Date().getTime()}`, {
                method: "POST",
                body: data
            })

            return response.json()
        },
        onMutate: () => {
            setFileInput(undefined);
            setFileUrl("");
        },
    });

    const query = useQuery({
        queryKey: [`/api/post?id=${postId}`],
        queryFn: async () => {
            const response = await fetch(`/api/post?id=${postId}`)
            return response.json()
        }
    });

    const handleFileChange = (files: FileList | null) => {
        if (!files) return;
        console.log(files);
        setFileUrl(URL.createObjectURL(files[0]));
        setFileInput(files[0]);
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!fileInput) return;

        let fileData = new FormData();
        fileData.append("file", fileInput);

        try {
            mutateFile.mutate(fileData);
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <>
            {
                query?.data?.file && query?.data?.file !== "" && (
                    <>
                        <h2 className="font-bold text-2xl text-center mt-8">Arquivo atual</h2>
                        <div className="h-1 bg-indigo-600 w-[100px] mx-auto my-4"></div>
                        <img src={`/assets/${query?.data?.file}`} alt="Arquivo atual" className="w-[250px] mx-auto my-4 rounded-xl border-4 border-green-500" />
                    </>
                )
            }

            <h2 className="font-bold text-2xl text-center mt-8">Arquivo</h2>
            <div className="h-1 bg-indigo-600 w-[100px] mx-auto my-4"></div>
            <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col w-full lg:w-1/2 mx-auto">
                <label htmlFor="file" className="font-bold my-4">Arquivo:</label>
                {
                    fileUrl && <img src={fileUrl} alt="Arquivo anexado" className="w-[250px] mx-auto my-4 rounded-xl border-4 border-orange-500" />
                }
                <input required type="file" id="file" className="py-4 px-2 rounded-xl border border-gray-400" onChange={(e) => handleFileChange(e.target.files)} />
                <button className="bg-gray-100 text-black p-2 rounded-xl border border-gray-400 my-8 hover:bg-black hover:text-white transition-all w-1/3 self-end">Enviar</button>
            </form>

            {
                (!mutateFile.data?.error && mutateFile.data?.content) && (
                    <div className="text-center text-green-600 font-bold uppercase">
                        Sucesso.
                    </div>
                )
            }

        </>
    )
}