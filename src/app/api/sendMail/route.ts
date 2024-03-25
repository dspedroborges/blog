import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
const nodemailer = require("nodemailer");

const smtp = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: "dasein.eigentlich@gmail.com",
        pass: "hjgq qdwq long qbzk"
    }
});

const configMail = {
    from: "dasein.eigentlich@gmail.com",
    to: "xpedrostewart@gmail.com",
    subject: "Teste",
    html: "<h1>Teste</h1>",
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    try {
        const mail = await smtp.sendMail(configMail);
        console.log(mail);
        return NextResponse.json({ error: false, content: "Sucesso", status: 201 });
    } catch (err: any) {
        console.log(err)
        return NextResponse.json({ error: true, content: "Erro", status: 400 });
    }

    
}