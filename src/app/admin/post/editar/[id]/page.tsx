import EditPostPage from "@/app/components/EditPostPage";
import prisma from "../../../../../../lib/prisma";

export default async function NovoPost({ params }: { params: { id: number } }) {
    const id = params.id;
    const post = await prisma.post.findUnique({
        where: {
            id: Number(id),
        }
    });

    console.log(post);

    return (
        <EditPostPage postData={post} />
    )
}