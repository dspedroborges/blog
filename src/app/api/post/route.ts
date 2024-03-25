import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function POST(request: NextRequest) {
    const { title, category, content } = await request.json();

    if (title !== "" && category !== "" && content !== "") {
        const post = await prisma.post.create({
            data: {
                title, category, content
            },
        })

        return NextResponse.json({error: false, content: "Post criado com sucesso", id: post.id, status: 201});
    } else {
        return NextResponse.json({error: true, content: "Erro ao criar post", status: 500});
    }
}

export async function PUT(request: NextRequest) {
    const { id, title, category, content } = await request.json();

    if (title !== "" && category !== "" && content !== "") {
        const post = await prisma.post.update({
            where: {
                id: Number(id),
            },
            data: {
                title, category, content
            },
        })

        return NextResponse.json({error: false, content: "Post atualizado com sucesso", id: post.id, status: 201});
    } else {
        return NextResponse.json({error: true, content: "Erro ao criar post", status: 500});
    }
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const currentPage = searchParams.get("currentPage");
    console.log(currentPage);
    let result;
    if (!id || id === "") {
        result = await prisma.post.findMany({
            skip: 10 * Number(currentPage),
            take: 10,
        });
    } else {
        result = await prisma.post.findUnique({
            where: {
                id: Number(id)
            }
        });
    }

    return NextResponse.json(result);
}