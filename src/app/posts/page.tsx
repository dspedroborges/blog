"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";

export default function Posts() {
    const [currentPage, setCurrentPage] = useState(0);
    const query = useQuery({
        queryKey: [`/api/post?currentPage=${currentPage}`, currentPage],
        queryFn: async () => {
            const response = await fetch(`/api/post?currentPage=${currentPage}`)
            return response.json()
        }
    });

    return (
        <>

            <div className="bg-white py-6 sm:py-8 lg:py-12">
                <div className="mx-auto max-w-screen-xl px-4 md:px-8">
                    {/* text - start */}
                    <div className="mb-10 md:mb-16">
                        <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl">
                            Blog
                        </h2>
                        <p className="mx-auto max-w-screen-md text-center text-gray-500 md:text-lg">
                            Confira abaixo os posts do nosso querido blog feito com Next 14, Tailwind e Prisma!
                        </p>
                    </div>
                    {/* text - end */}
                    <div className="grid gap-8 sm:grid-cols-2 sm:gap-12 lg:grid-cols-2 xl:grid-cols-2 xl:gap-16">
                        {/* article - start */}
                        {
                            query?.data?.map((post: typeof query.data[0], i: number) => {
                                return (
                                    <div key={i} className="flex flex-col items-center gap-4 md:flex-row lg:gap-6">
                                        <Link
                                            href={`/posts/${post.id}`}
                                            className="group relative block h-56 w-full shrink-0 self-start overflow-hidden rounded-lg bg-gray-100 shadow-lg md:h-24 md:w-24 lg:h-40 lg:w-40"
                                        >
                                            <img
                                                src={`/assets/${post.file}`}
                                                loading="lazy"
                                                alt={post.title}
                                                className="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110"
                                            />
                                        </Link>
                                        <div className="flex flex-col gap-2">
                                            <span className="text-sm text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</span>
                                            <h2 className="text-xl font-bold text-gray-800">
                                                <a
                                                    href="#"
                                                    className="transition duration-100 hover:text-indigo-500 active:text-indigo-600"
                                                >
                                                    {post.title}
                                                </a>
                                            </h2>
                                            <p className="text-gray-500">
                                                {post.content.slice(0, 100)}...
                                            </p>
                                            <div>
                                                <Link
                                                    href={`/posts/${post.id}`}
                                                    className="font-semibold text-indigo-500 transition duration-100 hover:text-indigo-600 active:text-indigo-700"
                                                >
                                                    Ler mais
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                        {/* article - end */}
                    </div>
                </div>
            </div>
            <div className="flex justify-around items-center bg-indigo-500 p-8 text-white fixed bottom-0 left-0 w-full">
                <button onClick={() => setCurrentPage(currentPage > 0 ? currentPage - 1 : 0)}>Anterior</button>
                <span>{currentPage + 1}</span>
                <button onClick={() => setCurrentPage(currentPage + 1)}>Próxima</button>
            </div>
        </>
    )
}