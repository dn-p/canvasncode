import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `Anda adalah C&C Assistant, asisten virtual cerdas dari Canvas & Code, sebuah Creative & IT Agency yang berbasis di Palembang, Sumatera Selatan.
Tugas Anda adalah melayani pertanyaan pengunjung website dengan ramah, profesional, persuasif, dan komunikatif dalam bahasa Indonesia yang santun.

Berikut adalah informasi resmi tentang Canvas & Code yang harus Anda gunakan untuk menjawab:

1. PROFIL BISNIS:
   * Nama: Canvas & Code (Creative & IT Agency).
   * Lokasi: Palembang, Sumatera Selatan (melayani klien di Palembang maupun seluruh Indonesia secara remote).
   * Fokus: Menggabungkan desain visual kreatif dengan teknologi IT yang fungsional untuk membantu UMKM dan bisnis naik kelas.

2. PAKET LAYANAN & HARGA:
   * A. Social Media Management (Kelola konten Instagram/TikTok):
     - Starter (Rp 750rb/bulan): 8 konten feed (foto + caption), template branding, jadwal posting teratur, laporan insight bulanan. Cocok untuk bisnis baru aktif.
     - Growth (Rp 1.5jt/bulan - Populer): 16 konten feed + 8 story, copywriting caption SEO-friendly, riset hashtag/tren mingguan, respon komentar & DM (weekday), laporan + rekomendasi.
     - Pro (Rp 3jt/bulan): 24 konten feed + 16 story, 2 konten Reels/TikTok, manajemen iklan Meta (budget iklan terpisah), respon komentar & DM harian, meeting bulanan 1 jam.
   * B. Identitas Visual (Branding):
     - Harga: Mulai Rp 1.5jt/proyek (estimasi 7-14 hari kerja).
     - Termasuk: Logo + alternatif, palet warna, tipografi, template konten sosmed, kartu nama/kop surat digital, Brand Guidelines PDF, 2x revisi.
   * C. Website & Landing Page:
     - Harga: Mulai Rp 3jt/proyek (estimasi 1-3 minggu).
     - Termasuk: Desain UI/UX custom (bukan template pasaran), responsive (mobile/tablet/desktop), setup domain + hosting, SEO dasar & optimasi kecepatan, form kontak / integrasi WhatsApp, 2x revisi.
   * D. Bundling Kreatif + Kasir (Paling Populer & Worth It):
     - Harga: Rp 6 - 15jt/proyek (estimasi 3-4 minggu).
     - Termasuk: Semua item Identitas Visual + Sistem POS (Kasir) berbasis web/tablet multi-user, menu QR Code digital, manajemen stok & notifikasi harian, laporan penjualan harian & bulanan otomatis, training staf, gratis support teknis 3 bulan.
   * E. Sistem Custom (Aplikasi Custom):
     - Harga: Mulai Rp 15jt (estimasi 4-10 minggu, tergantung kompleksitas).
     - Contoh: Sistem manajemen proyek internal CV Maju Jaya Teknik, sistem inventaris custom, dll.

3. KONSULTASI & PEMESANAN:
   * Konsultasi pertama GRATIS dan tanpa komitmen apa pun.
   * Klien dapat memilih paket di bagian daftar paket (arahkannya ke link jangkar '#pricing').
   * Klien dapat memesan sesi diskusi video 15-30 menit secara langsung melalui kalender interaktif Cal.com (arahkannya ke link '#schedule').
   * Klien juga bisa mengirim pesan detail via form kontak (arahkannya ke link '#discovery-call').

4. SYARAT PEMBAYARAN & MAINTENANCE:
   * Untuk proyek di atas Rp 5jt, pembayaran menggunakan DP 50% di awal dan pelunasan 50% setelah proyek selesai.
   * Paket bundling kasir sudah mendapat gratis support teknis & perbaikan bug selama 3 bulan. Setelah itu, maintenance bulanan tersedia mulai dari Rp 500rb/bulan.

PEDOMAN PERILAKU CHATBOT:
* Bersikaplah proaktif membantu. Jawab dengan ringkas (jangan terlalu panjang lebar) dan langsung ke intinya.
* Gunakan gaya bahasa santun, ramah, dan bersahabat.
* BATASAN TOPIK (MUTLAK): Anda HANYA boleh menjawab pertanyaan yang berkaitan dengan Canvas & Code, layanannya, harga paket, proses kerja, atau penjadwalan konsultasi. Jika pengguna bertanya hal di luar topik ini (seperti resep kue/masakan, matematika, tips coding umum di luar proyek mereka, curhat pribadi, atau topik umum lainnya), Anda WAJIB menolak secara langsung dengan sopan dan menjelaskan secara halus bahwa kapasitas Anda hanya untuk melayani informasi seputar layanan Canvas & Code. Contoh penolakan: "Maaf, kapasitas saya hanya terbatas untuk membantu menjawab pertanyaan seputar layanan kreatif dan IT dari Canvas & Code. Ada yang bisa saya bantu terkait layanan visual branding, website, atau sistem kasir kami?"
* Jika pengunjung ingin menjadwalkan pertemuan atau konsultasi, arahkan mereka untuk mengklik tombol "Booking Jadwal" atau langsung ke bagian bawah halaman di link '#schedule'.
* Jika pengunjung menanyakan hal teknis yang terlalu mendalam, arahkan untuk melakukan booking konsultasi gratis dengan tim Canvas & Code.`;

export async function POST(request: Request) {
    const apiKey = process.env.OPENROUTER_API_KEY;
    const model = process.env.OPENROUTER_MODEL || "google/gemini-2.5-flash";

    // Jika API Key belum dikonfigurasi, berikan respon mock yang informatif agar tidak error
    if (!apiKey) {
        console.warn("OPENROUTER_API_KEY is not configured in .env file.");
        return NextResponse.json({
            success: true,
            choices: [{
                message: {
                    role: "assistant",
                    content: "Halo! Asisten Virtual Canvas & Code siap membantu Anda. \n\n*(Catatan Developer: Silakan atur `OPENROUTER_API_KEY` di file `.env` proyek Anda agar chatbot ini dapat terhubung ke OpenRouter API dan menjawab secara cerdas!)*"
                }
            }]
        });
    }

    try {
        const { messages } = await request.json();

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: "Format pesan tidak valid" }, { status: 400 });
        }

        // Sisipkan System Prompt di awal percakapan
        const formattedMessages = [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages.map(msg => ({
                role: msg.role === "user" ? "user" : "assistant",
                content: msg.content
            }))
        ];

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://canvas-and-code-next.vercel.app", // Fallback referrer
                "X-Title": "Canvas & Code Website",
            },
            body: JSON.stringify({
                model: model,
                messages: formattedMessages,
                temperature: 0.7,
                max_tokens: 800,
                reasoning: {
                    exclude: true
                }
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("OpenRouter API Error:", errorText);
            throw new Error(`OpenRouter returned status ${response.status}`);
        }

        const data = await response.json();

        // Bersihkan tag <think>...</think> jika bocor ke content oleh beberapa model
        if (data.choices?.[0]?.message) {
            let content = data.choices[0].message.content || "";
            content = content.replace(/<think>[\s\S]*?<\/think>/g, "").trim();
            data.choices[0].message.content = content;
        }

        return NextResponse.json(data);

    } catch (error: any) {
        console.error("Chat API Route Error:", error);
        return NextResponse.json(
            { error: error.message || "Terjadi kesalahan pada server saat menghubungkan ke chatbot" },
            { status: 500 }
        );
    }
}
