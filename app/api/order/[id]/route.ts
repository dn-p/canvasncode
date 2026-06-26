import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const { status } = await request.json();

        const validStatuses = ["PENDING", "VERIFYING", "COMPLETED", "REJECTED"];
        if (!validStatuses.includes(status)) {
            return NextResponse.json({ error: "Status tidak valid" }, { status: 400 });
        }

        const order = await prisma.order.update({
            where: { id },
            data: { status },
        });

        return NextResponse.json({ success: true, order });
    } catch (error) {
        console.error("Update Order Status Error:", error);
        return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
    }
}
