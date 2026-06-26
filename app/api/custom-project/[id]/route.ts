import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await request.json();

        const validStatuses = ["REQUESTED", "QUOTED", "VERIFYING", "COMPLETED", "REJECTED"];

        // Update status only
        if (body.status && !body.totalAmount) {
            if (!validStatuses.includes(body.status)) {
                return NextResponse.json({ error: "Status tidak valid" }, { status: 400 });
            }
            const project = await prisma.customProject.update({
                where: { id },
                data: { status: body.status },
            });
            return NextResponse.json({ success: true, project });
        }

        // Set quote (totalAmount)
        if (!body.totalAmount || isNaN(Number(body.totalAmount))) {
            return NextResponse.json({ error: "Nilai project tidak valid" }, { status: 400 });
        }

        const project = await prisma.customProject.update({
            where: { id },
            data: { totalAmount: Number(body.totalAmount), status: "QUOTED" },
        });

        return NextResponse.json({ success: true, project });
    } catch (error) {
        console.error("Patch Custom Project Error:", error);
        return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
    }
}
