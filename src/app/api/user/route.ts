import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { encryptPassword } from "../auth/[...nextauth]/route";

export async function POST(request: NextRequest) {
    const { username, email, password, passwordConfirmation } = await request.json();

    if (username !== "" && email !== "" && password !== "" && passwordConfirmation !== "") {
        if (password !== passwordConfirmation) return NextResponse.json({error: true, content: "Senhas diferentes", status: 500});

        console.log({username, email, password});

        const post = await prisma.user.create({
            data: {
                username, email,
                password: await encryptPassword(password)
            },
        })

        return NextResponse.json({error: false, content: "Post criado com sucesso", id: post.id, status: 201});
    } else {
        return NextResponse.json({error: true, content: "Erro ao criar post", status: 500});
    }
}