import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";

// Inisialisasi Prisma
const prisma = new PrismaClient();

export async function POST(request: Request) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    try {
        // 1. Tangkap data FormData dari Frontend
        const formData = await request.formData();

        const customerName = formData.get("customerName") as string;
        const customerEmail = formData.get("customerEmail") as string;
        const serviceName = formData.get("serviceName") as string;
        const totalAmount = parseInt(formData.get("totalAmount") as string);
        const file = formData.get("receipt") as File;

        // Validasi sederhana
        if (!file || !customerName || !customerEmail || !totalAmount) {
            return NextResponse.json(
                { error: "Semua data dan bukti transfer wajib diisi" },
                { status: 400 }
            );
        }

        // 2. Siapkan Nama File Unik (agar file dengan nama sama tidak saling timpa)
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

        // 3. Upload Gambar ke Supabase Bucket 'receipts'
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from("receipts")
            .upload(fileName, file, { contentType: file.type || "image/jpeg" });

        if (uploadError) {
            console.error("Supabase Upload Error:", uploadError);
            return NextResponse.json({ error: "Gagal mengunggah bukti transfer" }, { status: 500 });
        }

        // 4. Dapatkan URL Publik dari gambar tersebut
        const { data: publicUrlData } = supabase.storage
            .from("receipts")
            .getPublicUrl(fileName);

        const receiptUrl = publicUrlData.publicUrl;

        // 5. Simpan Data Pesanan & URL Gambar ke Database PostgreSQL via Prisma
        const order = await prisma.order.create({
            data: {
                customerName,
                customerEmail,
                serviceName,
                totalAmount,
                receiptUrl,
                status: "VERIFYING", // Status awal langsung kita set VERIFYING karena struk sudah ada
            },
        });

        // 6. Kembalikan respons sukses ke Frontend
        return NextResponse.json({ success: true, order }, { status: 201 });

    } catch (error) {
        console.error("Checkout API Error:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan fatal pada server" },
            { status: 500 }
        );
    }
}