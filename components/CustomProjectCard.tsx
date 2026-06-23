"use client";

import { useState } from "react";

const CATEGORIES = ["Social Media Management", "Branding", "Web", "Lainnya"];

export default function CustomProjectCard() {
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({
        customerName: "",
        customerEmail: "",
        projectCategory: "",
        projectName: "",
        description: "",
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/custom-project", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Gagal mengirim request");
            setSubmitted(true);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Terjadi kesalahan");
        } finally {
            setLoading(false);
        }
    }

    function handleClose() {
        setOpen(false);
        setSubmitted(false);
        setError("");
        setForm({ customerName: "", customerEmail: "", projectCategory: "", projectName: "", description: "" });
    }

    return (
        <>
            {/* Wide Card */}
            <button
                onClick={() => setOpen(true)}
                className="w-full mt-6 bg-[#0A0A0F] text-white rounded-3xl p-6 sm:p-8 flex flex-row items-center justify-between gap-4 hover:bg-[#1A1A2E] transition-all duration-300 group text-left"
            >
                <div className="min-w-0">
                    <p className="text-xs font-bold tracking-[0.2em] text-[#1A56FF] uppercase mb-2">Custom Project</p>
                    <h3
                        className="text-white font-extrabold mb-1 leading-tight"
                        style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(1.1rem, 3vw, 1.5rem)' }}
                    >
                        Punya kebutuhan yang lebih spesifik?
                    </h3>
                    <p className="text-[#9A9A9A] text-sm">Ceritakan project-mu — kami yang tentukan harganya.</p>
                </div>
                <span className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#1A56FF] flex items-center justify-center text-white text-lg sm:text-xl group-hover:scale-110 transition-transform duration-200">
                    →
                </span>
            </button>

            {/* Modal */}
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" onClick={handleClose}>
                    <div
                        className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {submitted ? (
                            <div className="text-center py-8">
                                <div className="text-4xl mb-4">✓</div>
                                <h3 className="text-[#0A0A0F] text-xl font-extrabold mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>
                                    Request Terkirim!
                                </h3>
                                <p className="text-[#6B6B6B] text-sm mb-6">
                                    Kami akan review dan mengirimkan penawaran harga ke email kamu.
                                </p>
                                <button
                                    onClick={handleClose}
                                    className="px-6 py-3 bg-[#0A0A0F] text-white rounded-2xl font-bold text-sm hover:bg-[#1A56FF] transition-colors"
                                >
                                    Tutup
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-[#0A0A0F] text-xl font-extrabold" style={{ fontFamily: "'Syne', sans-serif" }}>
                                        Request Custom Project
                                    </h3>
                                    <button onClick={handleClose} className="text-[#9A9A9A] hover:text-[#0A0A0F] text-2xl leading-none">×</button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide block mb-1">Nama</label>
                                            <input
                                                name="customerName"
                                                value={form.customerName}
                                                onChange={handleChange}
                                                required
                                                placeholder="Nama / Nama Bisnis"
                                                className="w-full border border-[#E8E3D9] rounded-xl px-4 py-2.5 text-sm text-[#0A0A0F] focus:outline-none focus:border-[#1A56FF]"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide block mb-1">Email</label>
                                            <input
                                                name="customerEmail"
                                                type="email"
                                                value={form.customerEmail}
                                                onChange={handleChange}
                                                required
                                                placeholder="email@kamu.com"
                                                className="w-full border border-[#E8E3D9] rounded-xl px-4 py-2.5 text-sm text-[#0A0A0F] focus:outline-none focus:border-[#1A56FF]"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide block mb-1">Kategori</label>
                                        <select
                                            name="projectCategory"
                                            value={form.projectCategory}
                                            onChange={handleChange}
                                            required
                                            className="w-full border border-[#E8E3D9] rounded-xl px-4 py-2.5 text-sm text-[#0A0A0F] focus:outline-none focus:border-[#1A56FF] bg-white"
                                        >
                                            <option value="">Pilih kategori...</option>
                                            {CATEGORIES.map((c) => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide block mb-1">Nama Project</label>
                                        <input
                                            name="projectName"
                                            value={form.projectName}
                                            onChange={handleChange}
                                            required
                                            placeholder="Contoh: Website Toko Baju Online"
                                            className="w-full border border-[#E8E3D9] rounded-xl px-4 py-2.5 text-sm text-[#0A0A0F] focus:outline-none focus:border-[#1A56FF]"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide block mb-1">Deskripsi Kebutuhan</label>
                                        <textarea
                                            name="description"
                                            value={form.description}
                                            onChange={handleChange}
                                            required
                                            rows={4}
                                            placeholder="Ceritakan kebutuhan, referensi, atau detail lainnya..."
                                            className="w-full border border-[#E8E3D9] rounded-xl px-4 py-2.5 text-sm text-[#0A0A0F] focus:outline-none focus:border-[#1A56FF] resize-none"
                                        />
                                    </div>

                                    {error && <p className="text-red-500 text-xs">{error}</p>}

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-3 bg-[#1A56FF] text-white rounded-2xl font-bold text-sm hover:bg-[#0A40D0] transition-colors disabled:opacity-50"
                                    >
                                        {loading ? "Mengirim..." : "Kirim Request"}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
