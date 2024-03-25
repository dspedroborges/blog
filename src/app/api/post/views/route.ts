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

        const countView = await prisma.view.count({
            where: {
                userId: user?.id,
                postId: Number(postId)
            }
        });

        if (countView === 0 && user) {
            await prisma.view.create({
                data: {
                    postId: Number(postId),
                    userId: String(user?.id)
                },
            })
        } else {
            return NextResponse.json({error: true, status: 500});
        }
        return NextResponse.json({error: false, status: 201});
    } else {
        return NextResponse.json({error: true, status: 500});
    }
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    const result = await prisma.post.findUnique({
        where: {
            id: Number(id),
        },
        include: {
            View: true,
        }
    });

    return NextResponse.json({ count: result?.View.length });
}