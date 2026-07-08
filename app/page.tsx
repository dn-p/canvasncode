"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import Link from "next/link";
import CalButton from "@/components/CalButton";
import CustomProjectCard from "@/components/CustomProjectCard";
import ServiceCard from "@/components/ServiceCard";
import CheckoutModal, { CHECKOUT_PACKAGES } from "@/components/CheckoutModal";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
const TESTIMONIALS = [
  {
    name: 'Rini Kusuma',
    role: 'Owner',
    business: 'Warung Soto Rini',
    avatar: 'RK',
    text: 'Sebelumnya kasir kami masih manual, sering salah hitung dan stok berantakan. Sekarang dengan sistem POS dari Canvas & Code, laporan harian langsung muncul otomatis. Omzet naik 30% karena tidak ada lagi selisih kas.',
    tag: 'Bundling Kreatif + Kasir',
    tagColor: '#1A56FF',
  },
  {
    name: 'Dimas Pratama',
    role: 'Co-founder',
    business: 'Kopi Semangat',
    avatar: 'DP',
    text: 'Logo dan branding kami sebelumnya asal-asalan. Setelah revamp sama tim Canvas & Code, pelanggan bilang tampilan outlet kami sekarang lebih premium. Bahkan ada yang datang khusus karena lihat feed Instagram kami.',
    tag: 'Identitas Visual',
    tagColor: '#FF4D1C',
  },
  {
    name: 'Sari Wahyuni',
    role: 'Manager',
    business: 'Toko Batik Nusantara',
    avatar: 'SW',
    text: 'Kami butuh sistem inventaris yang simpel tapi powerful. Canvas & Code deliver tepat waktu dan sesuai budget. Yang paling saya suka, mereka mau nemenin training staf sampai beneran bisa pakai.',
    tag: 'Sistem Custom',
    tagColor: '#9333EA',
  },
  {
    name: 'Andi Firmansyah',
    role: 'Owner',
    business: 'Ayam Geprek Juara',
    avatar: 'AF',
    text: 'Menu QR Code yang mereka buatkan untuk outlet kami menghemat biaya cetak menu tiap ada perubahan harga. Proses update menu sekarang bisa saya lakukan sendiri lewat HP dalam 2 menit.',
    tag: 'Bundling Kreatif + Kasir',
    tagColor: '#1A56FF',
  },
  // {
  //   name: 'Mega Lestari',
  //   role: 'Founder',
  //   business: 'Skincare by Mega',
  //   avatar: 'ML',
  //   text: 'Landing page yang dibuat sangat clean dan convert. Dalam 2 minggu pertama sejak launch, ada 47 lead masuk dari iklan Meta. Tim Canvas & Code juga sabar banget dalam proses revisi.',
  //   tag: 'Identitas Visual',
  //   tagColor: '#FF4D1C',
  // },
  // {
  //   name: 'Budi Hartono',
  //   role: 'Direktur',
  //   business: 'CV Maju Jaya Teknik',
  //   avatar: 'BH',
  //   text: 'Perusahaan kami butuh sistem manajemen proyek internal yang bisa diakses tim di lapangan. Canvas & Code berhasil bangun solusi yang jauh melampaui ekspektasi kami, dengan harga yang sangat masuk akal.',
  //   tag: 'Sistem Custom',
  //   tagColor: '#9333EA',
  // },
];

const CARD_W = 420;
const CARD_GAP = 24;
const CARD_STEP = CARD_W + CARD_GAP;

function TestimonialCarousel() {
  const total = TESTIMONIALS.length;
  // Triple the array so we can scroll infinitely in both directions
  const slides = [...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS];

  // Start at the middle copy
  const [active, setActive] = useState(total);
  const [animated, setAnimated] = useState(true);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const realIndex = ((active % total) + total) % total;

  function goTo(index: number, withAnimation = true) {
    setAnimated(withAnimation);
    setActive(index);
  }

  function advance() {
    setActive((prev) => prev + 1);
    setAnimated(true);
  }

  // After sliding to the edge of a clone, jump silently to the real middle copy
  useEffect(() => {
    if (active >= total * 2) {
      const timer = setTimeout(() => goTo(active - total, false), 600);
      return () => clearTimeout(timer);
    }
    if (active < total) {
      const timer = setTimeout(() => goTo(active + total, false), 600);
      return () => clearTimeout(timer);
    }
  }, [active]);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(advance, 3500);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [paused]);

  return (
    <section
      className="bg-[#0A0A0F] py-32 overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Header */}
      <div className="px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-[#1A56FF] uppercase mb-4">
              Testimoni Klien
            </p>
            <h2
              className="text-[#F7F4EE] font-extrabold leading-tight"
              style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
            >
              Kata Mereka yang<br />Sudah Naik Level
            </h2>
          </div>
          <p className="text-[#5A5A6A] max-w-xs text-sm leading-relaxed">
            Bukan sekadar klaim. Cerita nyata dari UMKM & bisnis yang sudah bekerja sama dengan kami.
          </p>
        </div>
      </div>

      {/* Carousel track */}
      <div className="relative">
        <div className="pointer-events-none absolute left-0 top-0 h-full w-32 z-10"
          style={{ background: 'linear-gradient(to right, #0A0A0F, transparent)' }} />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-32 z-10"
          style={{ background: 'linear-gradient(to left, #0A0A0F, transparent)' }} />

        <div
          className="flex"
          style={{
            transform: `translateX(calc(50vw - ${CARD_W / 2}px - ${active * CARD_STEP}px))`,
            transition: animated ? 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
            gap: CARD_GAP,
            paddingBottom: '8px',
          }}
        >
          {slides.map((t, i) => {
            const isActive = i === active;
            return (
              <div
                key={i}
                onClick={() => { goTo(i); }}
                className="shrink-0 flex flex-col gap-5 rounded-3xl p-8 cursor-pointer border"
                style={{
                  width: CARD_W,
                  background: isActive ? '#111116' : '#0D0D12',
                  borderColor: isActive ? t.tagColor + '55' : '#1A1A22',
                  opacity: isActive ? 1 : 0.38,
                  transform: isActive ? 'scale(1)' : 'scale(0.88)',
                  transformOrigin: 'center center',
                  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: isActive ? `0 0 40px ${t.tagColor}18` : 'none',
                }}
              >
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, si) => (
                    <span key={si} className="text-[#FF4D1C] text-sm">★</span>
                  ))}
                </div>
                <p className="text-[#9A9A9A] text-sm leading-relaxed flex-grow">
                  &ldquo;{t.text}&rdquo;
                </p>
                <span
                  className="self-start text-xs font-bold px-3 py-1 rounded-full"
                  style={{ color: t.tagColor, background: `${t.tagColor}18` }}
                >
                  {t.tag}
                </span>
                <div className="flex items-center gap-4 pt-4 border-t border-[#1A1A22]">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                    style={{ background: `${t.tagColor}30`, color: t.tagColor }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-[#F7F4EE] text-sm font-bold">{t.name}</p>
                    <p className="text-[#5A5A6A] text-xs">{t.role} · {t.business}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dot indicators — based on real index */}
      <div className="flex items-center justify-center gap-2 mt-10">
        {TESTIMONIALS.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(total + i)}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === realIndex ? 24 : 6,
              height: 6,
              background: i === realIndex ? TESTIMONIALS[realIndex].tagColor : '#2A2A35',
            }}
          />
        ))}
      </div>
    </section>
  );
}

const FAQS = [
  {
    q: 'Apakah bisa konsultasi dulu sebelum memutuskan paket?',
    a: 'Tentu. Konsultasi pertama kami gratis dan tanpa komitmen. Anda bisa ceritakan kebutuhan bisnis, dan kami akan rekomendasikan solusi yang paling sesuai budget dan skala usaha Anda.',
  },
  {
    q: 'Berapa lama proses pengerjaan biasanya?',
    a: 'Paket Identitas Visual selesai dalam 7–14 hari kerja. Bundling Kreatif + Kasir sekitar 3–4 minggu. Sistem Custom bervariasi tergantung kompleksitas, biasanya 4–10 minggu. Semua timeline dikonfirmasi di awal proyek.',
  },
  {
    q: 'Apakah ada biaya maintenance setelah proyek selesai?',
    a: 'Untuk paket Bundling, sudah termasuk support teknis & bug-fix 3 bulan gratis. Setelah itu, maintenance bulanan tersedia mulai Rp 500rb/bln. Paket Identitas Visual tidak memerlukan maintenance rutin.',
  },
  {
    q: 'Apakah saya perlu punya pengetahuan teknis untuk menggunakan sistem yang dibuat?',
    a: 'Tidak perlu. Sistem kami dirancang agar mudah dipakai oleh staf tanpa latar belakang IT. Kami juga menyediakan training on-site dan panduan penggunaan.',
  },
  {
    q: 'Bisakah paket dikustomisasi sesuai kebutuhan spesifik bisnis saya?',
    a: 'Bisa. Semua paket bersifat fleksibel. Anda bisa menambah atau mengurangi fitur, dan harga akan disesuaikan berdasarkan scope yang disepakati di awal.',
  },
  {
    q: 'Metode pembayaran apa yang tersedia?',
    a: 'Kami menerima transfer bank dan e-wallet. Untuk proyek di atas Rp 5jt, tersedia skema DP 50% di awal dan pelunasan saat proyek selesai.',
  },
];

function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="bg-[#F7F4EE] py-32 px-6 sm:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-[#1A56FF] uppercase mb-4">
              FAQ
            </p>
            <h2
              className="text-[#0A0A0F] font-extrabold leading-tight"
              style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
            >
              Pertanyaan yang<br />Sering Diajukan
            </h2>
          </div>
          <p className="text-[#6B6B6B] max-w-xs text-sm leading-relaxed">
            Tidak menemukan jawaban yang Anda cari? Kirim pesan langsung lewat form di bawah.
          </p>
        </div>

        <div className="divide-y divide-[#E8E3D9]">
          {FAQS.map((faq, i) => (
            <div key={i}>
              <button
                className="w-full flex items-start justify-between gap-6 py-7 text-left group"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span
                  className="text-[#0A0A0F] font-semibold text-base leading-snug group-hover:text-[#1A56FF] transition-colors"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  {faq.q}
                </span>
                <span
                  className="shrink-0 w-7 h-7 rounded-full border border-[#D8D3C9] flex items-center justify-center text-[#6B6B6B] transition-all duration-300"
                  style={{ transform: open === i ? 'rotate(45deg)' : 'rotate(0deg)' }}
                >
                  +
                </span>
              </button>
              <div
                className="overflow-hidden transition-all duration-300"
                style={{ maxHeight: open === i ? '200px' : '0px', opacity: open === i ? 1 : 0 }}
              >
                <p className="text-[#6B6B6B] text-sm leading-relaxed pb-7 max-w-2xl">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const SOSMED_PACKAGES = [
  {
    name: 'Starter',
    price: 'Rp 750rb',
    period: '/bln',
    desc: 'Untuk bisnis yang baru aktif di sosmed.',
    accent: '#1A56FF',
    features: [
      '8 konten feed/bulan (foto + caption)',
      'Desain template branding',
      'Jadwal posting teratur',
      'Laporan insight bulanan',
    ],
  },
  {
    name: 'Growth',
    price: 'Rp 1.5jt',
    period: '/bln',
    desc: 'Untuk bisnis yang ingin tumbuh konsisten.',
    accent: '#FF4D1C',
    badge: 'Populer',
    features: [
      '16 konten feed + 8 story/bulan',
      'Copywriting caption SEO-friendly',
      'Riset hashtag & tren mingguan',
      'Respon komentar & DM (weekday)',
      'Laporan insight + rekomendasi',
    ],
  },
  {
    name: 'Pro',
    price: 'Rp 3jt',
    period: '/bln',
    desc: 'Untuk bisnis yang butuh kehadiran penuh.',
    accent: '#9333EA',
    features: [
      '24 konten feed + 16 story/bulan',
      '2 konten Reels/TikTok per bulan',
      'Manajemen iklan Meta (budget terpisah)',
      'Respon komentar & DM harian',
      'Laporan performa + strategi konten',
      'Meeting bulanan 1 jam',
    ],
  },
];

function SocialMediaCard({ onSelectPackage }: { onSelectPackage: (name: string) => void }) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="group bg-white border border-[#E8E3D9] rounded-3xl flex flex-col overflow-hidden hover:border-[#0A0A0F] transition-all duration-300">
      {/* Header */}
      <div className="p-8 pb-6">
        <p className="text-xs font-bold tracking-[0.15em] text-[#FF4D1C] uppercase mb-4">Social Media</p>
        <h3
          className="text-[#0A0A0F] text-2xl font-extrabold mb-2"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          Social Media Management
        </h3>
        <p className="text-[#6B6B6B] text-sm">Kelola konten, jadwal posting, dan pertumbuhan akun — biar tim kami yang handle.</p>
      </div>

      {/* Sub-packages — always visible */}
      <div className="px-8 pb-8 border-t border-[#E8E3D9] pt-6 space-y-3">
        <p className="text-xs font-semibold text-[#9A9A9A] uppercase tracking-wider mb-4">
          Pilih paket:
        </p>
        {SOSMED_PACKAGES.map((pkg) => (
          <div
            key={pkg.name}
            className="rounded-2xl border p-5 cursor-pointer transition-all duration-200"
            style={{
              borderColor: selected === pkg.name ? pkg.accent : '#E8E3D9',
              background: selected === pkg.name ? pkg.accent + '08' : 'transparent',
            }}
            onClick={() => setSelected(selected === pkg.name ? null : pkg.name)}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span
                  className="font-extrabold text-base"
                  style={{ fontFamily: "'Syne', sans-serif", color: pkg.accent }}
                >
                  {pkg.name}
                </span>
                {pkg.badge && (
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ color: pkg.accent, background: pkg.accent + '18' }}
                  >
                    {pkg.badge}
                  </span>
                )}
              </div>
              <span className="text-[#0A0A0F] font-extrabold text-base" style={{ fontFamily: "'Syne', sans-serif" }}>
                {pkg.price}<span className="text-[#9A9A9A] text-xs font-normal ml-1">{pkg.period}</span>
              </span>
            </div>
            <p className="text-[#6B6B6B] text-xs mb-3">{pkg.desc}</p>

            {/* Detail + button — expand on select */}
            <div
              className="overflow-hidden transition-all duration-300"
              style={{ maxHeight: selected === pkg.name ? '400px' : '0px' }}
            >
              <ul className="space-y-1.5 mb-4 pt-1">
                {pkg.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-[#3A3A3A]">
                    <span className="shrink-0 mt-0.5" style={{ color: pkg.accent }}>✦</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                  onClick={() => onSelectPackage(`Social Media — ${pkg.name}`)}
                  className="w-full py-2.5 rounded-xl text-xs font-bold border-2 transition-all duration-200 hover:text-white"
                  style={{ borderColor: pkg.accent, color: pkg.accent }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = pkg.accent; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                >
                  Pilih Paket Ini →
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [checkoutPkg, setCheckoutPkg] = useState<{ name: string; price: string; amount: number } | null>(null);

  function openCheckout(packageName: string) {
    const found = CHECKOUT_PACKAGES.find((p) => p.name === packageName);
    if (found) setCheckoutPkg(found);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormStatus('sending');
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      const res = await fetch('/api/discovery', {
        method: 'POST',
        body: data,
      });
      if (res.ok) {
        setFormStatus('sent');
        form.reset();
      } else {
        setFormStatus('error');
      }
    } catch {
      setFormStatus('error');
    }
  }
  return (
    <>
    <Navbar />
    <main className="flex min-h-screen flex-col bg-[#0A0A0F]">

      {/* ============================================================ */}
      {/* HERO — Asymmetric split, typographic-forward, dark           */}
      {/* ============================================================ */}
      <section className="relative min-h-screen flex flex-col justify-center px-6 sm:px-12 lg:px-20 pt-24 pb-16 overflow-hidden">
        
        {/* Subtle grid texture */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
          }}
        />

        {/* Orange accent bleed — top right corner */}
        <div className="absolute top-0 right-0 w-[420px] h-[420px] rounded-full"
          style={{
            background: 'radial-gradient(circle at top right, rgba(255,77,28,0.18) 0%, transparent 65%)',
          }}
        />

        {/* Blue accent bleed — bottom left */}
        <div className="absolute bottom-0 left-0 w-[380px] h-[380px] rounded-full"
          style={{
            background: 'radial-gradient(circle at bottom left, rgba(26,86,255,0.14) 0%, transparent 65%)',
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-10">
            <span className="inline-block w-8 h-[1px] bg-[#FF4D1C]" />
            <span className="text-xs font-semibold tracking-[0.2em] text-[#FF4D1C] uppercase">
              Creative + IT Agency · Palembang
            </span>
          </div>

          {/* Headline — large typographic treatment */}
          <div className="mb-12">
            <h1
              className="font-extrabold leading-[0.92] tracking-tight text-[#F7F4EE]"
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 'clamp(3.2rem, 8.5vw, 7.5rem)',
              }}
            >
              Bisnis Anda<br />
              <span className="text-[#9A9A9A]">
                Layak Tampil
              </span>
              <br />
              <span className="text-[#1A56FF]">
                &amp; Bekerja
              </span>{" "}
              <span className="text-[#FF4D1C]">Pintar.</span>
            </h1>
          </div>

          {/* Sub + CTA row */}
          <div className="flex flex-col lg:flex-row lg:items-end gap-10 lg:gap-20">
            <p className="text-[#9A9A9A] text-lg leading-relaxed max-w-md">
              Kami menggabungkan desain visual yang tajam dengan sistem IT yang fungsional — khusus untuk UMKM dan bisnis yang ingin naik level.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 shrink-0">
              <a
                href="#schedule"
                className="group flex items-center gap-3 bg-[#FF4D1C] text-white px-8 py-4 rounded-full font-bold text-sm tracking-wide hover:bg-[#e84318] transition-all active:scale-95"
              >
                Mulai Diskusi
                <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
              </a>
              <a
                href="#pricing"
                className="flex items-center gap-3 border border-[#2A2A30] text-[#9A9A9A] px-8 py-4 rounded-full font-bold text-sm tracking-wide hover:border-[#F7F4EE] hover:text-[#F7F4EE] transition-all active:scale-95"
              >
                Lihat Paket
              </a>
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-20 pt-10 border-t border-[#1A1A22] grid grid-cols-3 gap-6 max-w-lg">
            {[
              { n: '100%', label: 'Desain Kustom' },
              { n: '24 Jam', label: 'Respon Dukungan' },
              { n: '1-on-1', label: 'Fokus Pendampingan' },
            ].map((s) => (
              <div key={s.label}>
                <p
                  className="text-3xl font-extrabold text-[#F7F4EE]"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  {s.n}
                </p>
                <p className="text-xs text-[#5A5A6A] mt-1 tracking-wide uppercase">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* MARQUEE TICKER — Signature element                           */}
      {/* ============================================================ */}
      <div className="bg-[#FF4D1C] py-4 overflow-hidden">
        <style>{`
          @keyframes marquee {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .marquee-track {
            display: flex;
            width: max-content;
            animation: marquee 22s linear infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .marquee-track { animation: none; }
          }
        `}</style>
        <div className="marquee-track">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center">
              {[
                'Branding Visual', 'Sistem POS', 'Social Media', 'UI/UX Design',
                'Aplikasi Custom', 'Automasi Operasional', 'Landing Page', 'Konsultasi Digital',
              ].map((item) => (
                <span
                  key={item}
                  className="text-white font-bold text-sm tracking-widest uppercase mx-10 whitespace-nowrap"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  {item}
                  <span className="ml-10 text-[#FF8C6B]">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================ */}
      {/* VALUE PROPS — Dark, three columns with line-separator        */}
      {/* ============================================================ */}
      <section className="bg-[#0A0A0F] py-28 px-6 sm:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">

          <p className="text-xs font-semibold tracking-[0.2em] text-[#1A56FF] uppercase mb-16">
            Mengapa Canvas & Code
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#1A1A22]">
            {[
              {
                num: '01',
                title: 'Berorientasi Hasil',
                body: 'Setiap desain dirancang untuk meningkatkan konversi. Kami ukur dampaknya, bukan hanya tampilannya.',
              },
              {
                num: '02',
                title: 'Transparan & Jelas',
                body: 'Tidak ada biaya tersembunyi. Estimasi dan timeline yang jelas sejak kick-off pertama.',
              },
              {
                num: '03',
                title: 'Teknologi yang Pas',
                body: 'Sistem yang cukup canggih untuk efisiensi, cukup sederhana agar staf toko bisa langsung pakai.',
              },
            ].map((item) => (
              <div key={item.num} className="py-10 md:px-10 first:md:pl-0 last:md:pr-0">
                <p
                  className="text-[#E6E6EE] text-6xl font-extrabold mb-6 select-none"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  {item.num}
                </p>
                <h3
                  className="text-[#F7F4EE] text-xl font-bold mb-3"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  {item.title}
                </h3>
                <p className="text-[#5A5A6A] leading-relaxed text-sm">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* PRICING — Light cream background, premium card treatment     */}
      {/* ============================================================ */}
      <section id="pricing" className="bg-[#F7F4EE] py-32 px-6 sm:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-[#FF4D1C] uppercase mb-4">
                Paket Layanan
              </p>
              <h2
                className="text-[#0A0A0F] font-extrabold leading-tight"
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                }}
              >
                Investasi Digital<br />yang Terukur
              </h2>
            </div>
            <p className="text-[#6B6B6B] max-w-xs text-sm leading-relaxed">
              Dirancang berdasarkan riset langsung ke pelaku UMKM Palembang. Semua paket bisa dikustomisasi per proyek.
            </p>
          </div>

          {/* Row 1 — 3 service cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Social Media */}
            <SocialMediaCard onSelectPackage={openCheckout} />

            {/* Branding */}
            <div className="bg-white border border-[#E8E3D9] rounded-3xl p-8 flex flex-col hover:border-[#0A0A0F] transition-all duration-300">
              <div className="mb-6">
                <p className="text-xs font-bold tracking-[0.15em] text-[#FF4D1C] uppercase mb-4">Branding</p>
                <h3 className="text-[#0A0A0F] text-2xl font-extrabold mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>
                  Identitas Visual
                </h3>
                <p className="text-[#6B6B6B] text-sm">Logo, brand guidelines, dan aset visual yang bikin bisnis kamu diingat.</p>
              </div>
              <div className="mb-6 pb-6 border-b border-[#E8E3D9]">
                <span className="text-[#0A0A0F] text-4xl font-extrabold" style={{ fontFamily: "'Syne', sans-serif" }}>
                  Mulai 1.5jt
                </span>
                <span className="text-[#9A9A9A] text-sm ml-2">/proyek</span>
                <p className="text-[#9A9A9A] text-xs mt-2">Estimasi 7–14 hari kerja</p>
              </div>
              <ul className="space-y-3 flex-grow mb-8">
                {[
                  'Logo + alternatif variasi',
                  'Brand color palette & typography',
                  'Template konten sosial media',
                  'Kartu nama & kop surat digital',
                  'Brand guidelines (PDF)',
                  '2x revisi termasuk',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-[#3A3A3A]">
                    <span className="text-[#FF4D1C] mt-0.5 shrink-0 text-xs">✦</span>
                    {item}
                  </li>
                ))}
              </ul>
              <button onClick={() => openCheckout("Identitas Visual")} className="w-full py-3 rounded-2xl border-2 border-[#0A0A0F] text-[#0A0A0F] font-bold text-sm hover:bg-[#0A0A0F] hover:text-white transition-all duration-200">
                Pilih Paket
              </button>
            </div>

            {/* Web */}
            <div className="bg-white border border-[#E8E3D9] rounded-3xl p-8 flex flex-col hover:border-[#0A0A0F] transition-all duration-300">
              <div className="mb-6">
                <p className="text-xs font-bold tracking-[0.15em] text-[#9333EA] uppercase mb-4">Web</p>
                <h3 className="text-[#0A0A0F] text-2xl font-extrabold mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>
                  Website & Landing Page
                </h3>
                <p className="text-[#6B6B6B] text-sm">Website profesional yang fast, mobile-friendly, dan siap convert pengunjung jadi pelanggan.</p>
              </div>
              <div className="mb-6 pb-6 border-b border-[#E8E3D9]">
                <span className="text-[#0A0A0F] text-4xl font-extrabold" style={{ fontFamily: "'Syne', sans-serif" }}>
                  Mulai 3jt
                </span>
                <span className="text-[#9A9A9A] text-sm ml-2">/proyek</span>
                <p className="text-[#9A9A9A] text-xs mt-2">Estimasi 1–3 minggu</p>
              </div>
              <ul className="space-y-3 flex-grow mb-8">
                {[
                  'Desain UI/UX custom (bukan template)',
                  'Responsive — mobile, tablet, desktop',
                  'Setup domain + hosting',
                  'SEO dasar & optimasi performa',
                  'Form kontak / WhatsApp integration',
                  '2x revisi termasuk',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-[#3A3A3A]">
                    <span className="text-[#9333EA] mt-0.5 shrink-0 text-xs">✦</span>
                    {item}
                  </li>
                ))}
              </ul>
              <button onClick={() => openCheckout("Website & Landing Page")} className="w-full py-3 rounded-2xl border-2 border-[#0A0A0F] text-[#0A0A0F] font-bold text-sm hover:bg-[#0A0A0F] hover:text-white transition-all duration-200">
                Pilih Paket
              </button>
            </div>

          </div>

          {/* Row 2 — Bundling featured (full width) */}
          <div className="mt-6 bg-[#0A0A0F] rounded-3xl p-8 md:p-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="flex-1">
                <p className="text-xs font-bold tracking-[0.2em] text-[#1A56FF] uppercase mb-3">⭐ Most Popular</p>
                <h3 className="text-white text-2xl md:text-3xl font-extrabold mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>
                  Bundling Kreatif + Kasir
                </h3>
                <p className="text-[#6B6B6B] text-sm mb-6 max-w-lg">
                  Branding lengkap sekaligus sistem kasir digital — satu paket, satu vendor, satu harga. Paling worth it untuk UMKM yang mau naik level sekaligus.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    'Semua item Identitas Visual',
                    'Sistem POS web/tablet multi-user',
                    'Menu QR Code digital',
                    'Manajemen stok & notifikasi',
                    'Laporan penjualan harian & bulanan',
                    'Training staf + support 3 bulan',
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2 text-xs text-[#9A9A9A]">
                      <span className="text-[#1A56FF] shrink-0 mt-0.5">✦</span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="shrink-0 flex flex-col items-start md:items-end gap-4">
                <div>
                  <span className="text-white text-4xl font-extrabold" style={{ fontFamily: "'Syne', sans-serif" }}>Rp 6–15jt</span>
                  <span className="text-[#6B6B6B] text-sm ml-2">/proyek</span>
                  <p className="text-[#6B6B6B] text-xs mt-1">Estimasi 3–4 minggu · Harga final sesuai skala</p>
                </div>
                <button onClick={() => openCheckout("Bundling Kreatif + Kasir")} className="px-8 py-3 bg-[#1A56FF] text-white rounded-2xl font-bold text-sm hover:bg-[#0A40D0] transition-colors">
                  Konsultasi Gratis →
                </button>
              </div>
            </div>
          </div>

          <CustomProjectCard />

          </div>
      </section>

      {/* ============================================================ */}
      {/* TESTIMONIALS — Spotlight carousel, auto-scroll              */}
      {/* ============================================================ */}
      <TestimonialCarousel />

      {/* ============================================================ */}
      {/* FAQ — Dark background, accordion style                      */}
      {/* ============================================================ */}
      <FAQSection />

      {/* ============================================================ */}
      {/* DISCOVERY CALL — Kirim pesan, light background              */}
      {/* ============================================================ */}
      <section id="discovery-call" className="bg-[#0A0A0F] py-32 px-6 sm:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

            {/* Left — Copy */}
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-[#FF4D1C] uppercase mb-6">
                Discovery Call
              </p>
              <h2
                className="text-[#F7F4EE] font-extrabold leading-tight mb-8"
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 'clamp(2rem, 4.5vw, 3rem)',
                }}
              >
                Ceritakan kendala<br />operasional Anda.
              </h2>
              <p className="text-[#5A5A6A] leading-relaxed mb-10 text-sm max-w-sm">
                Kirimkan detail kebutuhan Anda melalui form ini. Tim kami akan membaca dan menghubungi balik dalam 24 jam.
              </p>
              <div className="space-y-4">
                {[
                  { icon: '📍', label: 'Palembang, Sumatera Selatan' },
                  { icon: '📲', label: 'Respon dalam 24 jam' },
                  { icon: '☕', label: 'Konsultasi pertama gratis' },
                ].map((c) => (
                  <div key={c.label} className="flex items-center gap-4">
                    <span className="text-lg w-8 text-center">{c.icon}</span>
                    <span className="text-[#9A9A9A] text-sm">{c.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Form */}
            <div className="bg-[#111116] border border-[#1A1A22] rounded-3xl p-8 md:p-10">
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-[#5A5A6A] uppercase tracking-wider mb-2">
                      Nama / Bisnis
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      className="w-full bg-[#0A0A0F] border border-[#2A2A35] text-[#F7F4EE] rounded-xl px-4 py-3 text-sm placeholder-[#3A3A45] focus:outline-none focus:border-[#1A56FF] transition-colors"
                      placeholder="Kopi Senja / Budi Santoso"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#5A5A6A] uppercase tracking-wider mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full bg-[#0A0A0F] border border-[#2A2A35] text-[#F7F4EE] rounded-xl px-4 py-3 text-sm placeholder-[#3A3A45] focus:outline-none focus:border-[#1A56FF] transition-colors"
                      placeholder="email@bisnis.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#5A5A6A] uppercase tracking-wider mb-2">
                    Layanan yang diminati
                  </label>
                  <select name="service" className="w-full bg-[#0A0A0F] border border-[#2A2A35] text-[#9A9A9A] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1A56FF] transition-colors">
                    <option value="">Pilih kategori...</option>
                    <option>Identitas Visual (Rp 2.5–5jt)</option>
                    <option>Bundling Kreatif + Kasir (Rp 6–15jt)</option>
                    <option>Sistem Custom / Full-Stack (Mulai 15jt)</option>
                    <option>Belum yakin, ingin konsultasi dulu</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#5A5A6A] uppercase tracking-wider mb-2">
                    Kendala saat ini
                  </label>
                  <textarea
                    rows={4}
                    name="message"
                    className="w-full bg-[#0A0A0F] border border-[#2A2A35] text-[#F7F4EE] rounded-xl px-4 py-3 text-sm placeholder-[#3A3A45] focus:outline-none focus:border-[#1A56FF] transition-colors resize-none"
                    placeholder="Ceritakan sistem kasir, branding, atau operasional yang ingin diperbaiki..."
                  />
                </div>

                {formStatus === 'sent' && (
                  <p className="text-sm text-green-600">Pesan terkirim! Kami akan menghubungi Anda dalam 24 jam.</p>
                )}
                {formStatus === 'error' && (
                  <p className="text-sm text-red-500">Gagal mengirim. Coba lagi atau hubungi kami langsung.</p>
                )}

                <button
                  type="submit"
                  disabled={formStatus === 'sending' || formStatus === 'sent'}
                  className="w-full bg-[#FF4D1C] text-white px-6 py-4 rounded-xl font-bold text-sm hover:bg-[#e84318] transition-all active:scale-95 text-center disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {formStatus === 'sending' ? 'Mengirim...' : formStatus === 'sent' ? 'Terkirim ✓' : 'Kirim Pesan →'}
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SCHEDULE A MEETING — Dark background, Cal.com embed         */}
      {/* ============================================================ */}
      <section id="schedule" className="bg-[#F7F4EE] py-32 px-6 sm:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

            {/* Left — Copy */}
            <div className="lg:sticky lg:top-32">
              <p className="text-xs font-semibold tracking-[0.2em] text-[#1A56FF] uppercase mb-6">
                Schedule a Meeting
              </p>
              <h2
                className="text-[#0A0A0F] font-extrabold leading-tight mb-6"
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
                }}
              >
                Pilih waktu yang<br />paling nyaman.
              </h2>
              <p className="text-[#6B6B6B] leading-relaxed mb-10 text-sm max-w-sm">
                Lebih suka ngobrol langsung? Booking slot 30 menit via kalender di sebelah kanan — pilih hari dan jam yang sesuai jadwal Anda.
              </p>
              <div className="space-y-5">
                {[
                  { icon: '🗓️', label: 'Sesi 15 menit via Cal Video' },
                  { icon: '🕐', label: 'Tersedia hari kerja, pagi & sore' },
                  { icon: '🆓', label: 'Gratis, tanpa komitmen apapun' },
                ].map((c) => (
                  <div key={c.label} className="flex items-center gap-4">
                    <span className="w-9 h-9 rounded-xl bg-white border border-[#E8E3D9] flex items-center justify-center text-base shrink-0">
                      {c.icon}
                    </span>
                    <span className="text-[#6B6B6B] text-sm">{c.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Calendar embed */}
            <CalButton />

          </div>
        </div>
      </section>

    </main>
    <Footer />

    <CheckoutModal
      isOpen={!!checkoutPkg}
      selectedPackage={checkoutPkg}
      onClose={() => setCheckoutPkg(null)}
    />
    </>
  );
}
