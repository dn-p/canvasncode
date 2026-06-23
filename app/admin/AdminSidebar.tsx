"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
    { href: "/admin", label: "Pesanan", icon: "📦" },
    { href: "/admin/report", label: "Laporan", icon: "📊" },
    { href: "/admin/tracking", label: "Tracking Project", icon: "🗂️" },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-56 shrink-0 bg-[#0D0D12] border-r border-[#1A1A22] min-h-screen flex flex-col">
            <div className="px-6 py-6 border-b border-[#1A1A22]">
                <p className="text-xs font-bold tracking-[0.2em] text-[#1A56FF] uppercase mb-1">Canvas & Code</p>
                <p className="text-white font-extrabold text-lg" style={{ fontFamily: "'Syne', sans-serif" }}>Admin</p>
            </div>

            <nav className="flex flex-col gap-1 p-4 flex-grow">
                {NAV.map((item) => {
                    const isActive = item.href === "/admin"
                        ? pathname === "/admin"
                        : pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                                isActive
                                    ? "bg-[#1A56FF] text-white"
                                    : "text-[#6B6B6B] hover:text-white hover:bg-[#1A1A22]"
                            }`}
                        >
                            <span>{item.icon}</span>
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="px-6 py-4 border-t border-[#1A1A22]">
                <a href="/" className="text-xs text-[#6B6B6B] hover:text-white transition-colors">
                    ← Kembali ke Site
                </a>
            </div>
        </aside>
    );
}
