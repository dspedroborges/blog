import { useSession } from "next-auth/react";
import prisma from "../../../../lib/prisma";
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { BsEye, BsHandThumbsUp, BsHandThumbsUpFill } from "react-icons/bs";
import { revalidatePath } from "next/cache";

export default async function PostId({ params }: { params: { id: number } }) {
    const id = params.id;
    const session = await getServerSession(authOptions);
    const username = String(session?.user?.name);

    const user = await prisma.user.findUnique({
        where: {
            username,
        },
        select: {
            id: true,
        }
    });

    if (user) {
        await prisma.view.create({
            data: {
                userId: String(user?.id),
                postId: Number(id)
            }
        });
    }

    const hasLiked = !user ? 0 : await prisma.like.count({
        where: {
            postId: Number(id),
            userId: user?.id
        }
    });

    const post = await prisma.post.findUnique({
        where: {
            id: Number(id)
        },
        include: {
            View: true,
            Like: true,
        }
    });

    const createLike = async (formData: FormData) => {
        "use server";

        const id = Number(formData.get("id"));
        const userLike = await prisma.like.findFirst({
            where: {
                userId: user?.id,
                postId: id
            }
        });

        if (!userLike && user) {
            await prisma.like.create({
                data: {
                    postId: id,
                    userId: String(user?.id)
                },
            })
        } else if (userLike && user) {
            await prisma.like.delete({
                where: {
                    id: Number(userLike?.id)
                },
            })
        }

        revalidatePath("/");
    }

    return (
        <>
            <h2 className="text-3xl text-center font-bold">{post?.title}</h2>
            <h3 className="text-xl text-center font-extralight">{post?.category}</h3>
            <div className="border-t border-b flex justify-start items-center gap-8 p-4 my-4 w-[60ch] mx-auto">
                <form action={createLike}>
                    <input type="hidden" name="id" value={post?.id} />
                    {
                        hasLiked > 0 ? (
                            <button className="flex items-center gap-2 hover:scale-105"><BsHandThumbsUpFill/> {post?.Like.length}</button>
                        ) : (
                            <button className="flex items-center gap-2 hover:scale-105"><BsHandThumbsUp/> {post?.Like.length}</button>
                        )
                    }
                </form>
                <span className="flex items-center gap-2"><BsEye/> {post?.View.length}</span>
            </div>
            <img src={`/assets/${post?.file}`} alt="Imagem do post" className="mx-auto my-8 w-[60ch]"/>
            <div className="flex flex-col justify-center items-center">
                {
                    post?.content.split('\n').map((p, i) => {
                        return (
                            <p key={i} className="my-2 w-[60ch] text-justify">{p}</p>
                        )
                    })
                }
            </div>
        </>
    )
}