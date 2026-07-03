'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const NAV_LINKS = [
    { href: '#features', label: 'Layanan' },
    { href: '#pricing', label: 'Paket' },
    { href: '#discovery-call', label: 'Kontak' },
];

export default function Navbar() {
    const [open, setOpen] = useState(false);

    return (
        <div className="fixed top-5 left-0 right-0 z-50 flex flex-col items-center px-4">
            {/* Pill navbar */}
            <nav className="w-fit bg-[#0A0A0F]/80 backdrop-blur-md border border-[#1A1A22] rounded-full px-5 py-2.5 flex items-center gap-8">

                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-2 text-base font-extrabold tracking-tighter text-[#F7F4EE]"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                >
                    <Image src="/mark.svg" alt="Canvas & Code" width={24} height={24} />
                    CANVAS<span className="text-[#FF4D1C]">CODE</span>
                </Link>

                {/* Desktop nav links */}
                <div className="hidden md:flex items-center gap-6">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm font-medium text-[#5A5A6A] hover:text-[#F7F4EE] transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Desktop CTA */}
                <div className="hidden md:flex">
                    <Link
                        href="#schedule"
                        className="bg-[#FF4D1C] text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-[#e84318] transition-all active:scale-95"
                        style={{ fontFamily: "'Syne', sans-serif" }}
                    >
                        Mulai Diskusi →
                    </Link>
                </div>

                {/* Mobile hamburger */}
                <button
                    className="md:hidden text-[#9A9A9A] hover:text-[#F7F4EE] transition-colors p-1"
                    aria-label={open ? 'Tutup menu' : 'Buka menu'}
                    onClick={() => setOpen((v) => !v)}
                >
                    {open ? (
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    ) : (
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <line x1="3" y1="12" x2="21" y2="12" />
                            <line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                    )}
                </button>
            </nav>

            {/* Mobile dropdown — di bawah pill */}
            {open && (
                <div className="w-full max-w-2xl mt-2 bg-[#0A0A0F]/90 backdrop-blur-md border border-[#1A1A22] rounded-3xl px-6 py-5 flex flex-col gap-4">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm font-medium text-[#5A5A6A] hover:text-[#F7F4EE] transition-colors"
                            onClick={() => setOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Link
                        href="#schedule"
                        className="mt-1 bg-[#FF4D1C] text-white px-5 py-3 rounded-full text-sm font-bold text-center hover:bg-[#e84318] transition-all"
                        onClick={() => setOpen(false)}
                    >
                        Mulai Diskusi →
                    </Link>
                </div>
            )}
        </div>
    );
}
