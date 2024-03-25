"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BsEye, BsHandThumbsUp, BsHandThumbsUpFill } from "react-icons/bs";

export default function PostId({ params }: { params: { id: number } }) {
    const id = params.id;
    const session = useSession();
    const username = session?.data?.user?.name;

    const query = useQuery({
        queryKey: [`/api/post?id=${id}`],
        queryFn: async () => {
            const response = await fetch(`/api/post?id=${id}`)
            return response.json()
        }
    });

    const queryView = useQuery({
        queryKey: [`/api/post/views?id=${id}`],
        queryFn: async () => {
            const response = await fetch(`/api/post/views?id=${id}`)
            return response.json()
        }
    });

    const queryIsLiked = useQuery({
        queryKey: [`/api/post/likes?username=${username}&id=${id}`],
        queryFn: async () => {
            const response = await fetch(`/api/post/likes?username=${username}&id=${id}`)
            return response.json()
        }
    });

    const queryLike = useQuery({
        queryKey: [`/api/post/likes?id=${id}`],
        queryFn: async () => {
            const response = await fetch(`/api/post/likes?id=${id}`)
            return response.json()
        }
    });

    const mutationView = useMutation({
        mutationFn: async (data: Record<string, string>) => {
            const response = await fetch("/api/post/views", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })

            return response.json()
        },
    });

    const mutationLike = useMutation({
        mutationFn: async (data: Record<string, string>) => {
            const response = await fetch("/api/post/likes", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })

            return response.json()
        },
        onSuccess: () => {
            queryLike.refetch();
            queryIsLiked.refetch();
        }
    });

    useEffect(() => {
        if (username !== "admin" && username && id) {
            mutationView.mutate({ username, postId: String(id) });
        }
    }, [username, id]);

    const handleLike = () => {
        if (username !== "admin" && username && id) {
            mutationLike.mutate({ username, postId: String(id) });
        }
    }

    return (
        <>
            {
                queryLike.isLoading || queryIsLiked.isLoading && <p className="text-center my-4">Carregando . . .</p>
            }
            <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl">
                {query?.data?.title}
            </h2>
            <h3 className="font-extralight uppercase text-xl text-center">{query?.data?.category}</h3>

            <div className="flex items-center justify-center gap-8 my-4 text-xl text-indigo-600">
                {
                    queryIsLiked?.data?.count > 0 ? (
                        <span className="hover:scale-110 cursor-pointer" onClick={() => handleLike()}><BsHandThumbsUpFill className="inline" /> {queryLike?.data?.count}</span>
                    ) : (
                        <span className="hover:scale-110 cursor-pointer" onClick={() => handleLike()}><BsHandThumbsUp className="inline" /> {queryLike?.data?.count}</span>
                    )
                }
                <span><BsEye className="inline" /> {queryView?.data?.count} </span>
            </div >

            {
                query.data?.content.split("\n").map((p: string, i: number) => {
                    return (
                        <p key={i} className="text-justify lg:w-[60ch] flex justify-center items-center mx-auto my-4">
                            {p}
                        </p>
                    )
                })
            }

            < img src={`/assets/${query?.data?.file}`
            } alt={`Imagem do post`} className="my-8 mx-auto rounded-xl w-[90%] lg:w-1/2 xl:w-1/4" />

            {
                username === "admin" && <Link href={`/admin/post/editar/${query?.data?.id}`} className="block text-center hover:underline bg-indigo-500 text-white p-8">Editar este post</Link>
            }
        </>
    )
}