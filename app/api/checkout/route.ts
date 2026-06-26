import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

    try {
        // 1. Tangkap data FormData dari Frontend
        const formData = await request.formData();

        const customerName = formData.get("customerName") as string;
        const customerEmail = formData.get("customerEmail") as string;
        const serviceName = formData.get("serviceName") as string;
        const totalAmountStr = formData.get("totalAmount") as string;
        const file = formData.get("receipt") as File | null;

        // Membersihkan format rupiah ke angka (misal "Rp 6.000.000" jadi 6000000)
        // Pastikan frontend juga mengirim angka bulat jika memungkinkan, tapi ini untuk jaga-jaga
        const cleanAmount = totalAmountStr ? totalAmountStr.replace(/\D/g, '') : "0";
        const totalAmount = parseInt(cleanAmount);

        // Validasi sederhana
        if (!file || !customerName || !customerEmail || isNaN(totalAmount)) {
            return NextResponse.json(
                { error: "Semua data dan bukti transfer wajib diisi" },
                { status: 400 }
            );
        }

        let receiptUrl: string | null = null;

        if (file && supabase) {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const fileExt = file.name.split('.').pop() || 'jpg';
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from("receipts")
                .upload(fileName, buffer, {
                    contentType: file.type || "image/jpeg",
                    upsert: false
                });

            if (uploadError) {
                console.error("Supabase Upload Error:", uploadError.message);
            } else {
                const { data: publicUrlData } = supabase.storage
                    .from("receipts")
                    .getPublicUrl(fileName);

                receiptUrl = publicUrlData.publicUrl;
            }
        } else if (file) {
            console.warn("Supabase storage is not configured; skipping receipt upload.");
        }

        // 5. Simpan Data ke Database
        const order = await prisma.order.create({
            data: {
                customerName,
                customerEmail,
                serviceName,
                totalAmount,
                receiptUrl,
                status: "VERIFYING",
            },
        });

        // 6. Sukses
        return NextResponse.json({ success: true, order }, { status: 201 });

    } catch (error: any) {
        console.error("Checkout API Error:", error);
        return NextResponse.json(
            { error: error.message || "Terjadi kesalahan fatal pada server" },
            { status: 500 }
        );
    }
}