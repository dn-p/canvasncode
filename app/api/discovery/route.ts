import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const formData = await request.formData();

        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const service = formData.get("service") as string;
        const message = formData.get("message") as string;

        if (!name || !email) {
            return NextResponse.json(
                { error: "Nama dan email wajib diisi" },
                { status: 400 }
            );
        }

        const entry = await prisma.discoveryCall.create({
            data: { name, email, service, message },
        });

        return NextResponse.json({ success: true, entry }, { status: 201 });
    } catch (error) {
        console.error("Discovery Call API Error:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan pada server" },
            { status: 500 }
        );
    }
}
