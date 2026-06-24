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

        // --- PERBAIKAN UTAMA DI SINI ---
        // Ubah File object menjadi ArrayBuffer lalu menjadi Buffer agar bisa dibaca Supabase
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // 2. Siapkan Nama File Unik
        const fileExt = file.name.split('.').pop() || 'jpg';
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

        // 3. Upload Gambar ke Supabase Bucket 'receipts'
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from("receipts")
            .upload(fileName, buffer, { // Gunakan 'buffer', bukan 'file'
                contentType: file.type || "image/jpeg",
                upsert: false // Jangan timpa file dengan nama sama
            });

        if (uploadError) {
            console.error("Supabase Upload Error:", uploadError.message);
            // Kita return pesan error asli dari Supabase agar kamu tahu masalahnya di frontend
            return NextResponse.json({ error: `Upload gagal: ${uploadError.message}` }, { status: 500 });
        }

        // 4. Dapatkan URL Publik
        const { data: publicUrlData } = supabase.storage
            .from("receipts")
            .getPublicUrl(fileName);

        const receiptUrl = publicUrlData.publicUrl;

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