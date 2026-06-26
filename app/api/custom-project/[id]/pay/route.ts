import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

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

        let receiptUrl: string | null = null;

        if (supabase) {
            const fileExt = file.name.split(".").pop();
            const fileName = `custom-${id}-${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from("receipts")
                .upload(fileName, file, { contentType: file.type || "image/jpeg" });

            if (uploadError) {
                return NextResponse.json(
                    { error: `Gagal upload bukti transfer: ${uploadError.message}` },
                    { status: 500 }
                );
            } else {
                const { data: publicUrlData } = supabase.storage.from("receipts").getPublicUrl(fileName);
                receiptUrl = publicUrlData.publicUrl;
            }
        } else {
            console.warn("Supabase storage is not configured; skipping receipt upload.");
        }

        const updated = await prisma.customProject.update({
            where: { id },
            data: { receiptUrl, status: "VERIFYING" },
        });

        return NextResponse.json({ success: true, project: updated });
    } catch (error) {
        console.error("Pay Custom Project Error:", error);
        return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
    }
}
