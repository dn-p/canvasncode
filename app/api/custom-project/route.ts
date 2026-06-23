import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { customerName, customerEmail, projectCategory, projectName, description } = body;

        if (!customerName || !customerEmail || !projectCategory || !projectName || !description) {
            return NextResponse.json({ error: "Semua field wajib diisi" }, { status: 400 });
        }

        const project = await prisma.customProject.create({
            data: { customerName, customerEmail, projectCategory, projectName, description },
        });

        return NextResponse.json({ success: true, project }, { status: 201 });
    } catch (error) {
        console.error("Custom Project API Error:", error);
        return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
    }
}
