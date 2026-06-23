import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";

const prisma = new PrismaClient();
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const formData = await request.formData();
        const file = formData.get("receipt") as File;

        if (!file) {
            return NextResponse.json({ error: "Bukti transfer wajib diupload" }, { status: 400 });
        }

        const project = await prisma.customProject.findUnique({ where: { id } });
        if (!project) {
            return NextResponse.json({ error: "Project tidak ditemukan" }, { status: 404 });
        }
        if (project.status !== "QUOTED") {
            return NextResponse.json({ error: "Project belum mendapat penawaran harga" }, { status: 400 });
        }

        const fileExt = file.name.split(".").pop();
        const fileName = `custom-${id}-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
            .from("receipts")
            .upload(fileName, file, { contentType: file.type || "image/jpeg" });

        if (uploadError) {
            console.error("Supabase Upload Error:", uploadError);
            return NextResponse.json({ error: "Gagal mengunggah bukti transfer" }, { status: 500 });
        }

        const { data: publicUrlData } = supabase.storage.from("receipts").getPublicUrl(fileName);

        const updated = await prisma.customProject.update({
            where: { id },
            data: { receiptUrl: publicUrlData.publicUrl, status: "VERIFYING" },
        });

        return NextResponse.json({ success: true, project: updated });
    } catch (error) {
        console.error("Pay Custom Project Error:", error);
        return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
    }
}
