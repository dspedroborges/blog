import SubmitConfirmationButton from "@/app/components/SubmitConfirmationButton";
import prisma from "../../../../../lib/prisma";
import { deletePost } from "@/app/components/actions/DeletePost";
import Link from "next/link";

export default async function TodosPosts() {
    const posts = await prisma.post.findMany();

    return (
        <>
            <h2 className="font-bold text-2xl text-center">Posts</h2>
            <div className="h-1 bg-indigo-600 w-[100px] mx-auto my-4"></div>
            {
                posts.map((post, i) => {
                    return (
                        <div>
                            <div className="flex justify-around items-center border-t border-x">
                                <span className="w-full text-center font-bold">Título</span>
                                <span className="w-full text-center font-bold">Categoria</span>
                                <span className="w-full text-center font-bold">Editar</span>
                                <span className="w-full text-center font-bold">Deletar</span>
                            </div>
                            <div className="flex justify-around items-center border">
                                <span className="border-r w-full text-center py-4 px-2">{post.title}</span>
                                <span className="border-r w-full text-center py-4 px-2">{post.category}</span>
                                <Link className="w-full py-4 px-2 text-center hover:underline" href={`/admin/post/editar/${post.id}`}>Editar</Link>
                                <form action={deletePost.bind(null, post?.id, post?.file as string)} className="w-full py-4 px-2">
                                    <SubmitConfirmationButton name="Deletar" loadingName="Deletando..." />
                                </form>
                            </div>
                        </div>
                    )
                })
            }
        </>
    )
}