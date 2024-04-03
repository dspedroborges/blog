"use server";

import { revalidatePath } from "next/cache";
import prisma from "../../../../lib/prisma";
import { join } from "path";
import { writeFile } from "fs/promises";

export type FormState = {
    title: string;
    content: string;
    category: string;
    file: File|undefined;
    message: string;
    error: boolean;
}

export async function createPost(previousState: FormState, formData: FormData) {
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const content = formData.get("content") as string;
    const file = formData.get("file") ? formData.get("file") as File : undefined;

    if (!((title !== "" && category !== "" && content !== "") && (title && category && content && file))) {
        return {
            ...{title, category, content, file: undefined},
            message: "Preencha todos os campos corretamente.",
            error: true
        }
    }

    // file upload
    const fileExtension = file.name.split(".").pop();
    const fileName = new Date().getTime() + "." + fileExtension;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const path = join(process.cwd(), "public/assets/" + fileName);

    try {
        await writeFile(path, buffer);
    } catch (error) {
        console.log("Ocorreu um arquivo ao tentar escrever o arquivo: ", error);
    }

    // post creation
    await prisma.post.create({
        data: {
            title, category, content, file: fileName
        },
    })

    // returns
    revalidatePath("/");
    return {
        ...{title, category, content, file: undefined},
        message: "Ok.",
        error: false
    }
}