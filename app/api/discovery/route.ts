import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function parseValue(value: unknown) {
    if (typeof value === "string") {
        return value.trim();
    }

    if (value instanceof File) {
        return value.name;
    }

    return "";
}

async function readPayload(request: Request) {
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data") || contentType.includes("application/x-www-form-urlencoded")) {
        const formData = await request.formData();
        return Object.fromEntries(Array.from(formData.entries()).map(([key, value]) => [key, parseValue(value)]));
    }

    if (contentType.includes("application/json")) {
        return await request.json();
    }

    try {
        return await request.json();
    } catch {
        const formData = await request.formData();
        return Object.fromEntries(Array.from(formData.entries()).map(([key, value]) => [key, parseValue(value)]));
    }
}

export async function POST(request: Request) {
    try {
        const payload = await readPayload(request);

        const name = parseValue(payload?.name);
        const email = parseValue(payload?.email);
        const service = parseValue(payload?.service);
        const message = parseValue(payload?.message);

        if (!name || !email) {
            return NextResponse.json(
                { error: "Nama dan email wajib diisi" },
                { status: 400 }
            );
        }

        const entry = await prisma.discoveryCall.create({
            data: { name, email, service: service || null, message: message || null },
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
