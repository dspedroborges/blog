import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
import prisma from "../../../../lib/prisma";
const fs = require('fs');

export async function POST(request: NextRequest) {    
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("postId");
    const newFileName = searchParams.get("fileName");

    console.log(newFileName);

    const current = await prisma.post.findUnique({
        where: {
            id: Number(postId)
        },
        select: {
            file: true,
        }
    });

    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
        return NextResponse.json({ error: true, content: "Arquivo não enviado" });
    }

    const fileExtension = file.name.split(".").pop();
    const fileName = newFileName + "." + fileExtension;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const path = join(process.cwd(), "public/assets/" + fileName);

    try {
        await writeFile(path, buffer);
    } catch (error) {
        console.log("Ocorreu um arquivo ao tentar escrever o arquivo: ", error);
        return NextResponse.json({ error: true, content: "Erro", status: 500 });
    }

    fs.unlink("public/assets/" + current?.file, (err: Record<string, string>) => {
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

    await prisma.post.update({
        where: {
            id: Number(postId),
        },
        data: {
            file: fileName
        },
    })

    return NextResponse.json({ error: false, content: "Arquivo salvo com sucesso", status: 201 });
}