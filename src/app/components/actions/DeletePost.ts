"use server";

import { revalidatePath } from "next/cache";
import prisma from "../../../../lib/prisma";
const fs = require('fs');

export type FormState = {
    postId: number;
    currentFileName: string;
    error: boolean;
    message: string;
}

export async function deletePost(postId: number, currentFileName: string) {
    if (!currentFileName || !postId) {
        return {
            error: true,
            message: "Dados inválidos!",
            ...{postId, currentFileName}
        }
    }

    // delete file
    fs.unlink("public/assets/" + currentFileName, (err: Record<string, string>) => {
        if (err) {
          if (err.code === 'ENOENT') {
            console.error("Arquivo inexistente.");
          } else {
            throw err;
          }
        } else {
          console.log("Arquivo deletado.");
        }
      });
    
    // delete post
    await prisma.post.delete({
        where: {
            id: postId,
        }
    });

    revalidatePath("/");
    return {
        error: false,
        message: "Post excluído com sucesso!",
        ...{postId, currentFileName}
    }
}