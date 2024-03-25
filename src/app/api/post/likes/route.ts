import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

export async function POST(request: NextRequest) {
    const { username, postId } = await request.json();

    if (username && postId) {

        const user = await prisma.user.findUnique({
            where: {
                username,
            },
            select: {
                id: true,
            }
        });

        const userLikes = await prisma.like.findMany({
            where: {
                userId: user?.id,
                postId: Number(postId)
            }
        });

        if (userLikes.length === 0 && user) {
            await prisma.like.create({
                data: {
                    postId: Number(postId),
                    userId: String(user?.id)
                },
            })
        } else {
            await prisma.like.delete({
                where: {
                    id: userLikes[0].id
                },
            })

            return NextResponse.json({ error: true, content: "Like removido!", status: 201 });
        }
        return NextResponse.json({ error: false, content: "Like registrado!", status: 201 });
    } else {
        return NextResponse.json({ error: true, status: 500 });
    }
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const username = searchParams.get("username");

    if (id && !username) {
        const result = await prisma.like.count({
            where: {
                postId: Number(id)
            }
        });

        return NextResponse.json({ count: result, status: 201 });
    } else if (username && id) {
        const user = await prisma.user.findUnique({
            where: {
                username,
            },
            select: {
                id: true,
            }
        });
        const result = await prisma.like.count({
            where: {
                postId: Number(id),
                userId: user?.id
            }
        });

        return NextResponse.json({ count: result, status: 201 });
    }

    return NextResponse.json({ error: true, status: 404 });
}